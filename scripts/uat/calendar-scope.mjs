/*
 * UAT browser Calendar Scope & Import — Chrome headless lewat CDP.
 *
 * Pola yang sama dengan `payroll-dashboard.mjs`: tanpa Playwright,
 * memakai paket `ws` yang sudah ada dan Chrome yang sudah terpasang.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/calendar-scope.mjs
 *
 * Yang diperiksa:
 *   - layar Work Calendar & Holiday terbuka tanpa error konsol
 *   - kolom Scope dan Applies To benar-benar ada
 *   - baris GLOBAL tampil sebagai "All Companies", bukan satu baris
 *     per perusahaan
 *   - kolom Working Days terbaca (`Mon-Fri`), bukan tujuh kolom centang
 *   - tombol Import/Export/Template ada dan rutenya hidup
 *   - layar import memuat judul, profil, dan tombol template
 *
 * PRASYARAT DATA: tenant harus memuat contoh keempat cakupan —
 * termasuk satu Holiday bercakupan SELECTED_COMPANIES. Tanpa itu
 * pemeriksaan cakupan tersebut gagal karena **datanya** tidak ada,
 * bukan karena layarnya rusak; bedakan keduanya sebelum melaporkannya
 * sebagai bug.
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_USER, UAT_PASS, UAT_OUT.
 * Keluar dengan kode 1 kalau ada pemeriksaan yang gagal.
 */
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import WebSocket from 'ws'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9334
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT
  ?? path.join(os.tmpdir(), 'meinova-uat-calendar-scope')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function launch() {
  const profile = path.join(OUT, 'chrome-profile')

  // Chrome sisa run sebelumnya ditutup dulu — kalau tidak, run ini
  // menempel ke browser lama lengkap dengan sesinya, dan tangkapan
  // layarnya berbohong soal siapa yang sedang melihat.
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
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      if (res.ok)
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

/*
 * Satu bacaan halaman untuk seluruh pemeriksaan isi — membacanya
 * sepotong-sepotong berarti tiap pemeriksaan melihat keadaan yang
 * sedikit berbeda, dan yang gagal jadi tidak bisa dipercaya menyebut
 * sebabnya.
 */
const READ_TABLE = `
  (() => {
    const cells = row => [...row.querySelectorAll("td")].map(td => td.innerText.trim())
    const headers = [...document.querySelectorAll("th")].map(n => n.innerText.trim())
    const rows = [...document.querySelectorAll("tbody tr")].map(cells)
    const buttons = [...document.querySelectorAll("button")].map(b => b.innerText.trim()).filter(Boolean)
    return {
      headers,
      rows,
      buttons,
      text: document.body.innerText,
      hasNaN: /NaN|undefined|\\[object Object\\]/.test(document.body.innerText),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    }
  })()
`

const report = []

function log(label, ok, detail = '') {
  report.push({ label, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
}

function columnIndex(headers, name) {
  return headers.findIndex(h => h.toLowerCase() === name.toLowerCase())
}

/*
 * Tab diklik lewat **pointer event sungguhan**, bukan `element.click()`.
 *
 * Dua sebabnya, dan yang kedua yang menghabiskan waktu paling banyak
 * saat UAT ini ditulis: `TabsTrigger` Reka UI mendengarkan pointer,
 * dan — lebih menipu — dropdown "Actions" yang masih terbuka memasang
 * overlay yang **menelan** klik berikutnya tanpa satu pun error.
 * Gejalanya: tab-nya "diklik", pemeriksaan berjalan, dan yang terbaca
 * tetap tabel sebelumnya. Karena itu Escape ditekan lebih dulu.
 */
async function closeOverlays(cdp) {
  for (const type of ['keyDown', 'keyUp']) {
    await cdp.send('Input.dispatchKeyEvent', {
      type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27,
    })
  }
  await sleep(800)
}

async function openTab(cdp, label) {
  await closeOverlays(cdp)

  const box = await evaluate(cdp, `
    (() => {
      const want = ${JSON.stringify(label)}
      const el = [...document.querySelectorAll("[role=tab]")]
        .find(n => n.innerText.trim() === want)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `)

  if (!box)
    return 'tab tidak ditemukan'

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type, x: box.x, y: box.y, button: 'left', clickCount: 1,
    })
  }

  await sleep(4000)

  return 'ok'
}

/*
 * Import, Export, dan Download Template duduk di dalam dropdown
 * "Actions" — bukan sebagai tombol lepas di toolbar. Membacanya dari
 * `document.querySelectorAll("button")` saat menu masih tertutup
 * selalu menghasilkan "tidak ada", dan itu temuan palsu: menu yang
 * belum dibuka memang tidak punya isi di DOM.
 */
async function actionMenuItems(cdp) {
  const opened = await evaluate(cdp, `
    (() => {
      const b = [...document.querySelectorAll("button")]
        .find(x => /^Actions$/i.test(x.innerText.trim()))
      if (!b) return false
      b.click()
      return true
    })()
  `)

  if (!opened)
    return []

  await sleep(1500)

  const items = await evaluate(cdp, `
    [...document.querySelectorAll("[role=menuitem]")]
      .map(n => (n.innerText || "").trim()).filter(Boolean)
  `)

  await closeOverlays(cdp)

  return items
}


/*
 * Mengurutkan tabel lewat klik header kolom.
 *
 * Dipakai untuk memunculkan baris SELECTED_COMPANIES, dan itu bukan
 * kerumitan yang dicari-cari: tabel Holiday diurutkan tanggal dan
 * dipaginasi, jadi cuti bersama akhir Desember **tidak ada di halaman
 * pertama**. Memeriksanya dari halaman pertama saja menghasilkan
 * "tidak ada" yang terbaca seperti bug, padahal barisnya cuma ada di
 * halaman lain.
 *
 * Klik header dipilih daripada dropdown filter dengan sengaja:
 * `MLookupSelect` merender daftarnya lewat portal dengan struktur
 * yang harus ditebak, dan tebakan yang meleset membuat UAT gagal pada
 * komponen yang bahkan bukan sasarannya.
 */
async function sortByColumn(cdp, label) {
  await closeOverlays(cdp)

  const box = await evaluate(cdp, `
    (() => {
      const want = ${JSON.stringify('__LABEL__')}
      const th = [...document.querySelectorAll("th")]
        .find(n => n.innerText.trim().toLowerCase() === want.toLowerCase())
      if (!th) return null
      const target = th.querySelector("button") ?? th
      const r = target.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `.replace('"__LABEL__"', JSON.stringify(label)))

  if (!box)
    return 'kolom tidak ada'

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type, x: box.x, y: box.y, button: 'left', clickCount: 1,
    })
  }

  await sleep(3500)

  return 'ok'
}

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  const chrome = await launch()
  const cdp = await attach()

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  await cdp.send('Network.enable')

  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false,
    })

    // --- 3. login -----------------------------------------------------
    const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: USER, password: PASS }),
    })).json()

    if (!auth.access)
      throw new Error(`Login API gagal: ${JSON.stringify(auth)}`)

    await goto(cdp, `${BASE}/`, 3000)

    for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]]) {
      await cdp.send('Network.setCookie', {
        name, value, url: BASE, path: '/', sameSite: 'Lax',
      })
    }

    await goto(cdp, `${BASE}/`, 6000)

    const pathname = await evaluate(cdp, 'location.pathname')
    log('3. Login aplikasi', !pathname.includes('login'), `pathname=${pathname}`)

    // --- 4. Work Calendar ---------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/administration/calendar`, 9000)

    const tab = await openTab(cdp, 'Work Calendar')
    log('4. Tab Work Calendar terbuka', tab === 'ok', tab === 'ok' ? '' : tab)

    const wc = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'work-calendar')

    const consoleErrors = cdp.events
      .filter(e => (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
        || e.method === 'Runtime.exceptionThrown')
      .map(e => e.params?.entry?.text ?? e.params?.exceptionDetails?.text)

    log('4. Tanpa error konsol', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '))
    log('4. Kolom Scope ada', columnIndex(wc.headers, 'Scope') >= 0, wc.headers.join(' | '))
    log('4. Kolom Applies To ada', columnIndex(wc.headers, 'Applies To') >= 0)
    log('4. Kolom Working Days ada', columnIndex(wc.headers, 'Working Days') >= 0)
    log('4. Tidak ada NaN/undefined', !wc.hasNaN)

    const scopeIdx = columnIndex(wc.headers, 'Scope')
    const appliesIdx = columnIndex(wc.headers, 'Applies To')
    const daysIdx = columnIndex(wc.headers, 'Working Days')

    const globalRows = wc.rows.filter(r => (r[scopeIdx] ?? '').toUpperCase().includes('GLOBAL')
      || (r[appliesIdx] ?? '') === 'All Companies')

    log('4. GLOBAL tampil "All Companies"',
      globalRows.length > 0 && globalRows.every(r => r[appliesIdx] === 'All Companies'),
      globalRows.map(r => `${r[scopeIdx]}→${r[appliesIdx]}`).join(', ') || 'tidak ada baris GLOBAL')

    const companyRows = wc.rows.filter(r => (r[scopeIdx] ?? '').toUpperCase() === 'COMPANY')
    const locationRows = wc.rows.filter(r => (r[scopeIdx] ?? '').toUpperCase() === 'LOCATION')

    log('4. Baris COMPANY ada & Applies To terisi',
      companyRows.length > 0 && companyRows.every(r => r[appliesIdx] && r[appliesIdx] !== '-'),
      `${companyRows.length} baris`)

    log('4. Baris LOCATION menyebut lokasi',
      locationRows.length > 0 && locationRows.every(r => (r[appliesIdx] ?? '').includes('·')),
      locationRows.slice(0, 2).map(r => r[appliesIdx]).join(' / '))

    log('4. Working Days ringkas (mis. Mon-Fri)',
      wc.rows.length > 0 && wc.rows.every(r => /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Every day|-)/.test(r[daysIdx] ?? '')),
      wc.rows.slice(0, 3).map(r => r[daysIdx]).join(' / '))

    log('4. Tujuh kolom centang harian sudah hilang',
      !['Monday', 'Sunday'].some(d => columnIndex(wc.headers, d) >= 0))

    const wcMenu = await actionMenuItems(cdp)
    log('6. Menu Actions memuat Import', wcMenu.some(i => /^Import$/i.test(i)), wcMenu.join(' / '))
    log('6. Menu Actions memuat Download Template', wcMenu.some(i => /Template/i.test(i)))
    log('6. Menu Actions memuat Export', wcMenu.some(i => /^Export$/i.test(i)))

    // --- 6. layar Import Work Calendar --------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/administration/calendar/work-calendar/import`, 8000)

    const wcImport = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'work-calendar-import')

    log('6. Rute /work-calendar/import hidup',
      !/404|Page not found/i.test(wcImport.text),
      wcImport.text.slice(0, 80).replace(/\n/g, ' '))

    log('6. Judul "Import Work Calendars"',
      /Import Work Calendars/i.test(wcImport.text))

    log('6. Layar import menyebut Template',
      /Template/i.test(wcImport.text),
      wcImport.buttons.slice(0, 8).join(' | '))

    // --- 5. Holiday ----------------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/administration/calendar`, 9000)

    const htab = await openTab(cdp, 'Holiday')
    log('5. Tab Holiday terbuka', htab === 'ok', htab === 'ok' ? '' : htab)

    const hol = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'holiday')

    const hErrors = cdp.events
      .filter(e => (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
        || e.method === 'Runtime.exceptionThrown')
      .map(e => e.params?.entry?.text ?? e.params?.exceptionDetails?.text)

    log('5. Tanpa error konsol', hErrors.length === 0, hErrors.slice(0, 2).join(' | '))
    log('5. Kolom Scope ada', columnIndex(hol.headers, 'Scope') >= 0, hol.headers.join(' | '))
    log('5. Kolom Applies To ada', columnIndex(hol.headers, 'Applies To') >= 0)
    log('5. Kolom Source ada', columnIndex(hol.headers, 'Source') >= 0)
    log('5. Tidak ada NaN/undefined', !hol.hasNaN)

    const hScope = columnIndex(hol.headers, 'Scope')
    const hApplies = columnIndex(hol.headers, 'Applies To')

    const hGlobal = hol.rows.filter(r => (r[hScope] ?? '').toUpperCase().includes('GLOBAL'))
    const hSelected = hol.rows.filter(r => (r[hScope] ?? '').toUpperCase().includes('SELECTED'))
    const hLocation = hol.rows.filter(r => (r[hScope] ?? '').toUpperCase() === 'LOCATION')

    log('5. GLOBAL tampil "All Companies"',
      hGlobal.length > 0 && hGlobal.every(r => r[hApplies] === 'All Companies'),
      hGlobal.map(r => r[hApplies]).join(', ') || 'tidak ada')

    // Halaman pertama diurutkan tanggal, jadi cuti bersama akhir
    // Desember belum tentu terlihat. Disaring dulu lewat filter Scope.
    const picked = await sortByColumn(cdp, 'Code')
    const holSel = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'holiday-selected-companies')

    const selScope = columnIndex(holSel.headers, 'Scope')
    const selApplies = columnIndex(holSel.headers, 'Applies To')
    const selRows = holSel.rows.filter(r => (r[selScope] ?? '').toUpperCase().includes('SELECTED'))

    log('5. SELECTED_COMPANIES tampil jumlahnya',
      picked === 'ok' && selRows.length > 0
      && selRows.every(r => /\d+ companies/.test(r[selApplies] ?? '')),
      picked === 'ok'
        ? (selRows.map(r => `${r[selApplies]}`).join(', ') || 'tidak ada baris setelah difilter')
        : picked)

    log('5. LOCATION menyebut lokasi',
      hLocation.length > 0 && hLocation.every(r => (r[hApplies] ?? '').includes('·')),
      hLocation.slice(0, 2).map(r => r[hApplies]).join(' / '))

    const holMenu = await actionMenuItems(cdp)
    log('7. Menu Actions memuat Import', holMenu.some(i => /^Import$/i.test(i)), holMenu.join(' / '))
    log('7. Menu Actions memuat Download Template', holMenu.some(i => /Template/i.test(i)))

    // --- 7. layar Import Holiday ---------------------------------------
    await goto(cdp, `${BASE}/administration/calendar/holiday/import`, 8000)

    const hImport = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'holiday-import')

    log('7. Rute /holiday/import hidup',
      !/404|Page not found/i.test(hImport.text),
      hImport.text.slice(0, 80).replace(/\n/g, ' '))

    log('7. Judul "Import Holidays"', /Import Holidays/i.test(hImport.text))
    log('7. Layar import menyebut Template', /Template/i.test(hImport.text))

    log('Tanpa scroll horizontal', !hol.horizontalOverflow)
  }
  finally {
    cdp.close()
    chrome.kill()
  }

  const failed = report.filter(r => !r.ok)

  console.log(`\n${report.length - failed.length}/${report.length} pemeriksaan lolos`)
  console.log(`Tangkapan layar: ${OUT}`)

  if (failed.length) {
    console.log('\nGAGAL:')
    for (const f of failed) console.log(`  - ${f.label}${f.detail ? `: ${f.detail}` : ''}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
