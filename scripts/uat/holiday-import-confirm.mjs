/*
 * UAT browser: Holiday Import sampai **worker benar-benar mengerjakan**.
 *
 * Ditulis untuk membuktikan satu hal saja — bahwa `confirm/` tidak lagi
 * gagal `[Errno 61] Connection refused` di `run_import.delay()`. UAT
 * sebelumnya berhenti tepat di situ, dan sebabnya proses lama, bukan
 * kode importer.
 *
 *     node scripts/uat/holiday-import-confirm.mjs
 *
 * Alurnya utuh lewat layar: Upload → Preview → Confirm → antrian
 * Celery → worker → baris terlihat di tabel Holiday. Lalu berkas yang
 * sama diunggah ulang untuk memastikan tidak ada duplikat.
 *
 * PRASYARAT: Nuxt :3000, Django :8000, Redis, dan worker Celery hidup.
 */
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import WebSocket from 'ws'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9335
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), 'meinova-uat-holiday-confirm')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}
const CSV = process.env.UAT_CSV

const sleep = ms => new Promise(r => setTimeout(r, ms))
const report = []

function log(label, ok, detail = '') {
  report.push({ label, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
}

async function launch() {
  const profile = path.join(OUT, 'chrome-profile')
  try {
    const live = await fetch(`http://127.0.0.1:${PORT}/json/version`)
    if (live.ok) {
      const socket = new WebSocket((await live.json()).webSocketDebuggerUrl)
      await new Promise(resolve => socket.once('open', resolve))
      socket.send(JSON.stringify({ id: 1, method: 'Browser.close' }))
      await sleep(1500)
      socket.close()
    }
  }
  catch {}

  await fs.rm(profile, { recursive: true, force: true })

  const proc = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    '--window-size=1600,1100',
    'about:blank',
  ], { stdio: 'ignore', detached: false })

  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok)
        return proc
    }
    catch {}
    await sleep(500)
  }
  throw new Error('Chrome tidak pernah siap')
}

async function attach() {
  const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
  const page = targets.find(t => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl, { maxPayload: 256 * 1024 * 1024 })
  await new Promise(r => ws.once('open', r))

  let id = 0
  const pending = new Map()
  const events = []

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw.toString())
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
    }
    else if (msg.method) { events.push(msg) }
  })

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id
    pending.set(mid, { resolve, reject })
    ws.send(JSON.stringify({ id: mid, method, params }))
  })

  return { send, events, close: () => ws.close() }
}

async function evaluate(cdp, expression) {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (exceptionDetails)
    throw new Error(JSON.stringify(exceptionDetails))
  return result.value
}

async function shot(cdp, name) {
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  })
  const file = path.join(OUT, `${name}.png`)
  await fs.writeFile(file, Buffer.from(data, 'base64'))
  return file
}

async function goto(cdp, url, waitMs = 5000) {
  await cdp.send('Page.navigate', { url })
  await sleep(waitMs)
}

// Tombol diklik lewat pointer sungguhan; overlay dropdown menelan
// `element.click()` tanpa satu pun error — pelajaran dari UAT sebelumnya.
async function clickButton(cdp, matcher) {
  const box = await evaluate(cdp, `
    (() => {
      const re = ${matcher}
      const el = [...document.querySelectorAll("button")]
        .find(b => re.test(b.innerText.trim()) && !b.disabled)
      if (!el) return null
      el.scrollIntoView({ block: "center" })
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: el.innerText.trim() }
    })()
  `)

  if (!box)
    return null

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x: box.x,
      y: box.y,
      button: 'left',
      clickCount: 1,
    })
  }
  return box.label
}

/*
 * Profil import dipilih lewat `MLookupSelect` — bukan `<select>`.
 * Pemicunya harus diklik dulu, baru daftarnya ada di DOM.
 */
async function pickProfile(cdp) {
  const trigger = await evaluate(cdp, `
    (() => {
      const el = [...document.querySelectorAll("button,[role=combobox]")]
        .find(b => /Select import profile|Import Profile/i.test(b.innerText.trim()))
      if (!el) return null
      el.scrollIntoView({ block: "center" })
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `)

  if (!trigger)
    return 'pemicu profil tidak ditemukan'

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x: trigger.x,
      y: trigger.y,
      button: 'left',
      clickCount: 1,
    })
  }

  await sleep(3000)

  // Daftarnya dirender **inline**, bukan di popover: tiap opsi sebuah
  // <button>. Pencarian yang mengandalkan [role=option] atau wrapper
  // popper tidak menemukan apa pun di sini.
  const option = await evaluate(cdp, `
    (() => {
      const el = [...document.querySelectorAll("button")]
        .filter(n => n.innerText.trim() === "Holiday CSV (Default)")
        .filter(n => n.getBoundingClientRect().height > 0)[0]
      if (!el) return null
      el.scrollIntoView({ block: "center" })
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: el.innerText.trim() }
    })()
  `)

  if (!option)
    return 'opsi profil tidak ditemukan'

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x: option.x,
      y: option.y,
      button: 'left',
      clickCount: 1,
    })
  }

  await sleep(2500)

  const still = await evaluate(cdp, 'location.pathname')
  if (!still.includes('/holiday/import'))
    return `berpindah halaman ke ${still}`

  return 'ok'
}

async function openTab(cdp, label) {
  for (const type of ['keyDown', 'keyUp']) {
    await cdp.send('Input.dispatchKeyEvent', {
      type,
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    })
  }
  await sleep(800)

  const box = await evaluate(cdp, `
    (() => {
      const el = [...document.querySelectorAll("[role=tab]")]
        .find(n => n.innerText.trim() === ${JSON.stringify('LABEL')})
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `.replace('LABEL', label))

  if (!box)
    return 'tab tidak ditemukan'

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x: box.x,
      y: box.y,
      button: 'left',
      clickCount: 1,
    })
  }

  await sleep(4500)
  return 'ok'
}

async function setFile(cdp, filePath) {
  // Overlay lookup yang masih terbuka menutupi form; tanpa Escape
  // `DOM.querySelector` memang menemukan input-nya, tapi perubahannya
  // tidak pernah sampai ke form di baliknya.
  for (const type of ['keyDown', 'keyUp']) {
    await cdp.send('Input.dispatchKeyEvent', {
      type,
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    })
  }
  await sleep(1200)

  const seen = await evaluate(cdp, 'document.querySelectorAll("input[type=file]").length')

  const doc = await cdp.send('DOM.getDocument', { depth: -1, pierce: true })
  const { nodeId } = await cdp.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: 'input[type=file]',
  })

  if (!nodeId)
    throw new Error(`input file tidak ditemukan (querySelectorAll melihat ${seen})`)

  await cdp.send('DOM.setFileInputFiles', { files: [filePath], nodeId })
  await sleep(2000)
}

const PAGE_STATE = `
  (() => ({
    text: document.body.innerText,
    buttons: [...document.querySelectorAll("button")]
      .map(b => ({ label: b.innerText.trim(), disabled: b.disabled }))
      .filter(b => b.label),
    rows: [...document.querySelectorAll("tbody tr")]
      .map(r => [...r.querySelectorAll("td")].map(td => td.innerText.trim())),
    headers: [...document.querySelectorAll("th")].map(n => n.innerText.trim()),
  }))()
`

async function runImportOnce(cdp, label) {
  await goto(cdp, `${BASE}/administration/calendar/holiday/import`, 9000)

  const before = await evaluate(cdp, PAGE_STATE)
  if (!/Import/i.test(before.text))
    throw new Error(`layar import tidak terbuka (${label})`)

  const picked = await pickProfile(cdp)
  if (picked !== 'ok')
    throw new Error(`profil import gagal dipilih (${label}): ${picked}`)

  await setFile(cdp, CSV)

  const previewBtn = await clickButton(cdp, '/^Preview$/i')
  if (!previewBtn)
    throw new Error(`tombol Preview tidak aktif (${label}) — profil belum terpilih?`)

  await sleep(9000)
  const preview = await evaluate(cdp, PAGE_STATE)
  await shot(cdp, `${label}-preview`)

  const confirmBtn = await clickButton(cdp, '/Import \\d+ Valid Rows/i')
  if (!confirmBtn)
    return { preview, confirmed: false, final: preview }

  // Inilah yang diuji: confirm → run_import.delay() → worker.
  let final = null
  for (let i = 0; i < 40; i++) {
    await sleep(3000)
    final = await evaluate(cdp, PAGE_STATE)
    if (/Completed|Imported|Created|Updated|Failed|Error/i.test(final.text))
      break
  }

  await shot(cdp, `${label}-completed`)
  return { preview, confirmed: true, confirmLabel: confirmBtn, final }
}

async function main() {
  if (!CSV)
    throw new Error('UAT_CSV wajib diisi')

  await fs.mkdir(OUT, { recursive: true })

  const chrome = await launch()
  const cdp = await attach()

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  await cdp.send('Network.enable')

  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    })

    const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: USER, password: PASS }),
    })).json()

    if (!auth.access)
      throw new Error(`Login API gagal: ${JSON.stringify(auth)}`)

    await goto(cdp, `${BASE}/`, 3000)
    for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]]) {
      await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })
    }
    await goto(cdp, `${BASE}/`, 6000)

    log('Login aplikasi', !(await evaluate(cdp, 'location.pathname')).includes('login'))

    // --- Import pertama ------------------------------------------------
    cdp.events.length = 0
    const first = await runImportOnce(cdp, 'first')

    log(
      'Preview membaca 1 baris valid',
      /1 Valid Rows/i.test(JSON.stringify(first.preview.buttons)),
      first.preview.buttons.map(b => b.label).join(' | '),
    )

    log('Confirm terkirim', first.confirmed, first.confirmLabel ?? '')

    const noBrokerError = !/Connection refused|Errno 61|500/i.test(first.final.text)
    log('Tidak ada Errno 61 / Connection refused', noBrokerError)

    const finished = /Completed|Imported|Created/i.test(first.final.text)
    log('Worker menyelesaikan job', finished, first.final.text.split('\n').slice(0, 6).join(' / '))

    // --- Re-import berkas yang sama ------------------------------------
    const second = await runImportOnce(cdp, 'second')

    log(
      'Re-import: worker selesai lagi',
      /Completed|Imported|Updated|Created/i.test(second.final.text),
      second.final.text.split('\n').slice(0, 6).join(' / '),
    )

    // --- Barisnya terlihat di layar Holiday --------------------------
    await goto(cdp, `${BASE}/administration/calendar`, 9000)
    const tab = await openTab(cdp, 'Holiday')
    const table = await evaluate(cdp, PAGE_STATE)
    await shot(cdp, 'holiday-table')

    const hit = table.rows.filter(r => r.some(c => c.includes('UAT-WORKER-2026')))

    log('Baris hasil import terlihat di UI', hit.length === 1, `${hit.length} baris — ${hit[0]?.join(' | ') ?? tab}`)
    log(
      'Tetap GLOBAL / All Companies, bukan satu baris per perusahaan',
      hit.length === 1 && hit[0].some(c => /All Companies/i.test(c)),
      hit[0]?.join(' | ') ?? '',
    )

    // Konsol bersih
    const consoleErrors = cdp.events
      .filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
      .map(e => e.params.entry.text)
      .filter(t => !/favicon/i.test(t))

    log('Tidak ada error konsol', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  }
  finally {
    cdp.close()
    chrome.kill()
  }

  const failed = report.filter(r => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} pemeriksaan lulus`)
  console.log(`Tangkapan layar: ${OUT}`)

  if (failed.length)
    process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
