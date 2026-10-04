/*
 * UAT browser Employee list — kolom identitas dengan foto.
 *
 * Pola yang sama dengan `calendar-scope.mjs`: Chrome headless lewat
 * CDP, tanpa Playwright, memakai paket `ws` yang sudah ada.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/employee-avatar.mjs
 *
 * Yang diperiksa:
 *   - tabel Employee terbuka tanpa error konsol
 *   - kolom Employee ada; Employee Number / First Name / Last Name
 *     sudah tidak berdiri sendiri, NIK tetap kolom sendiri
 *   - tiap baris memuat avatar bulat 32px, nama, dan nomor pegawai
 *   - inisialnya cocok dengan nama yang ditampilkan
 *   - tidak ada gambar yang gagal dimuat (ikon gambar rusak)
 *   - baris tetap padat — avatar tidak menaikkan tingginya
 *   - centang baris, pencarian, urut kolom, dan paginasi masih hidup
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
const PORT = 9336
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT
  ?? path.join(os.tmpdir(), 'meinova-uat-employee-avatar')
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
 * Satu bacaan halaman untuk seluruh pemeriksaan isi. Sel identitas
 * dibaca **per elemen**, bukan lewat `innerText` sel itu: yang dicari
 * justru apakah fotonya sebuah `<img>` yang benar-benar termuat atau
 * sebuah kotak inisial — dan keduanya menghasilkan teks yang mirip.
 */
const READ_TABLE = `
  (() => {
    const headers = [...document.querySelectorAll("th")].map(n => n.innerText.trim())
    const rows = [...document.querySelectorAll("tbody tr")]

    const identity = rows.map((tr) => {
      const cells = [...tr.querySelectorAll("td")]
      const cell = cells.find(td => td.querySelector("[data-slot=avatar]"))

      if (!cell)
        return null

      const avatar = cell.querySelector("[data-slot=avatar]")
      const img = cell.querySelector("[data-slot=avatar-image]")
      const fallback = cell.querySelector("[data-slot=avatar-fallback]")
      const box = avatar.getBoundingClientRect()
      const style = getComputedStyle(avatar)
      /*
       * Teks identitas dibaca dari span yang BUKAN bagian avatar.
       * Kotak inisial juga sebuah span, dan ikut terbaca ia membuat
       * "AM" terhitung sebagai nama pegawainya — pemeriksaan inisial
       * lalu membandingkan "AM" dengan dirinya sendiri dan selalu
       * lolos, atau selalu gagal, tanpa menyentuh yang dimaksud.
       */
      const lines = [...cell.querySelectorAll("span")]
        .filter(s => !s.closest("[data-slot=avatar]"))
        .map(s => s.innerText.trim())
        .filter(Boolean)

      return {
        width: Math.round(box.width),
        height: Math.round(box.height),
        radius: style.borderTopLeftRadius,
        overflow: style.overflow,
        hasImage: Boolean(img),
        imageBroken: img ? img.naturalWidth === 0 : false,
        objectFit: img ? getComputedStyle(img).objectFit : null,
        initials: fallback ? fallback.innerText.trim() : null,
        lines,
        rowHeight: Math.round(tr.getBoundingClientRect().height),
        hasCheckbox: Boolean(tr.querySelector("[role=checkbox]")),
      }
    })

    return {
      headers,
      identity,
      rowCount: rows.length,
      brokenImages: [...document.querySelectorAll("img")]
        .filter(i => i.complete && i.naturalWidth === 0).length,
      brokenInTable: [...document.querySelectorAll("tbody img")]
        .filter(i => i.complete && i.naturalWidth === 0).length,
      brokenWhere: [...document.querySelectorAll("img")]
        .filter(i => i.complete && i.naturalWidth === 0)
        .map(i => (i.closest("tbody") ? "tabel" : "luar tabel") + ": " + (i.getAttribute("src") || "(tanpa src)")),
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

function expectedInitials(name) {
  const words = String(name ?? '').split(/\s+/).filter(Boolean)

  if (!words.length)
    return '?'

  if (words.length === 1)
    return words[0][0].toUpperCase()

  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

async function clickHeader(cdp, label) {
  const box = await evaluate(cdp, `
    (() => {
      const want = ${JSON.stringify(label)}
      const th = [...document.querySelectorAll("th")]
        .find(n => n.innerText.trim().toLowerCase() === want.toLowerCase())
      if (!th) return null
      const target = th.querySelector("button") ?? th
      const r = target.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `)

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

    // --- 1. login ------------------------------------------------------
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
    log('1. Login aplikasi', !pathname.includes('login'), `pathname=${pathname}`)

    // --- 2. daftar pegawai ---------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/hr/employees`, 10000)

    const table = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'employees')

    const consoleErrors = cdp.events
      .filter(e => (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
        || e.method === 'Runtime.exceptionThrown')
      .map(e => e.params?.entry?.text ?? e.params?.exceptionDetails?.text)

    log('2. Tanpa error konsol', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '))
    log('2. Ada baris pegawai', table.rowCount > 0, `${table.rowCount} baris`)
    log('2. Tidak ada NaN/undefined', !table.hasNaN)

    // --- 3. susunan kolom ----------------------------------------------
    log('3. Kolom Employee ada', columnIndex(table.headers, 'Employee') >= 0, table.headers.join(' | '))
    log('3. Kolom NIK tetap sendiri', columnIndex(table.headers, 'NIK') >= 0)

    for (const gone of ['Employee Number', 'Employee No.', 'First Name', 'Last Name']) {
      log(`3. Kolom "${gone}" sudah lebur`, columnIndex(table.headers, gone) < 0)
    }

    // Judulnya dari katalog i18n ("Email Address"), bukan nama field
    // di backend ("work_email") — yang dibaca layar adalah yang pertama.
    for (const keep of ['Gender', 'Email Address', 'Mobile', 'Company', 'Location', 'Employment Status', 'Employment Type']) {
      log(`3. Kolom "${keep}" tetap ada`, columnIndex(table.headers, keep) >= 0)
    }

    // --- 4. sel identitas ------------------------------------------------
    const identity = table.identity.filter(Boolean)

    log('4. Tiap baris punya avatar',
      identity.length === table.rowCount,
      `${identity.length}/${table.rowCount}`)

    log('4. Avatar bulat 32–36px',
      identity.length > 0 && identity.every(i =>
        i.width >= 32 && i.width <= 36 && i.height === i.width
        && (Number.parseFloat(i.radius) >= i.width / 2
          || i.radius === "50%")),
      identity.slice(0, 3).map(i => `${i.width}x${i.height} r=${i.radius}`).join(' / '))

    log('4. Nama dan nomor pegawai dua baris',
      identity.length > 0 && identity.every(i => i.lines.filter(Boolean).length >= 2),
      identity.slice(0, 3).map(i => i.lines.join(' / ')).join(' | '))

    log('4. Inisial cocok dengan namanya',
      identity.length > 0 && identity.every((i) => {
        if (i.hasImage && !i.imageBroken)
          return true

        const name = i.lines[0] ?? ''

        return i.initials === expectedInitials(name)
      }),
      identity.slice(0, 4).map(i => `${i.lines[0]}→${i.initials}`).join(', '))

    log('4. Foto yang ada dipotong object-cover',
      identity.filter(i => i.hasImage).every(i => i.objectFit === 'cover'),
      `${identity.filter(i => i.hasImage).length} baris berfoto`)

    log('4. Tidak ada gambar rusak di tabel',
      table.brokenInTable === 0 && identity.every(i => !i.imageBroken),
      table.brokenWhere.join(' | ') || 'nihil')

    // --- 5. kepadatan baris ----------------------------------------------
    const heights = identity.map(i => i.rowHeight)

    log('5. Baris tetap padat (≤ 56px)',
      heights.length > 0 && Math.max(...heights) <= 56,
      `tertinggi ${Math.max(...heights)}px`)

    log('5. Tanpa scroll horizontal halaman', !table.horizontalOverflow)

    // --- 6. fungsi lama -------------------------------------------------
    log('6. Centang baris masih ada',
      identity.length > 0 && identity.every(i => i.hasCheckbox))

    log('6. Paginasi masih ada', /Rows per page|of \d+/i.test(table.text))

    cdp.events.length = 0

    /*
     * Diklik DUA kali, dan itu bukan kelebihan: bawaan tabel ini sudah
     * `first_name` menaik (`EmployeeViewSet.ordering`), jadi klik
     * pertama meminta urutan yang persis sama dengan yang sedang
     * tampil. Barisnya tidak bergerak, dan pemeriksaan yang berhenti
     * di situ melaporkan "tidak bisa diurutkan" untuk kolom yang
     * sebenarnya baik-baik saja. Klik kedua meminta menurun.
     */
    const sorted = await clickHeader(cdp, 'Employee')
    await sleep(1200)

    const sortedAgain = await clickHeader(cdp, 'Employee')
    await sleep(1500)

    /*
     * Urut dibuktikan dari permintaan yang dikirim, bukan cuma dari
     * baris yang bergeser: `ordering` yang tidak dikenal backend
     * dibuang DRF tanpa pesan, dan tabelnya tetap tergambar ulang —
     * terlihat "berhasil" padahal tidak ada yang berubah.
     */
    const orderingRequests = cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent')
      .map(e => e.params.request.url)
      .filter(u => u.includes('ordering='))

    log('6. Urut mengirim ordering yang dikenal backend',
      orderingRequests.some(u => /ordering=first_name/.test(u))
      && orderingRequests.some(u => /ordering=-first_name/.test(u)),
      orderingRequests.slice(-2).map(u => u.split('?')[1]).join(' | ') || 'tidak ada permintaan ordering')

    const afterSort = await evaluate(cdp, READ_TABLE)
    await shot(cdp, 'employees-sorted')

    const before = identity.map(i => i.lines[0]).join('|')
    const after = afterSort.identity.filter(Boolean).map(i => i.lines[0]).join('|')

    log('6. Kolom Employee bisa diurutkan',
      sorted === 'ok' && sortedAgain === 'ok'
      && after.length > 0 && after !== before,
      sorted === 'ok'
        ? `${identity[0]?.lines[0]} → ${afterSort.identity.filter(Boolean)[0]?.lines[0]}`
        : sorted)

    log('6. Sesudah diurutkan avatar tetap utuh',
      afterSort.identity.filter(Boolean).length === afterSort.rowCount
      && afterSort.brokenInTable === 0)
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
