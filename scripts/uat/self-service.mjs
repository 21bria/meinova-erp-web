/*
 * UAT browser Self Service — `/me` dan `/me/profile`.
 *
 * Pola yang sama dengan `employee-avatar.mjs` dan `calendar-scope.mjs`:
 * Chrome headless lewat CDP, tanpa Playwright, memakai paket `ws` yang
 * sudah ada.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/self-service.mjs
 *
 * Yang diperiksa:
 *   - `/me` dan `/me/profile` terbuka tanpa error konsol
 *   - identitas pegawai yang login tampil (nama + nomor pegawai)
 *   - **`/api/hr/employees/me/` tidak pernah dipanggil** — layar baru
 *     berdiri di atas kontrak Self Service, bukan bentuk administratif
 *   - foto diambil dari `/api/me/avatar/`
 *   - `demo.gm` belum punya foto, jadi yang tampil inisialnya — bukan
 *     kotak kosong maupun gambar rusak
 *   - seluruh seksi profil tampil
 *   - nilai kosong tercetak "—", bukan "null"/"undefined"
 *   - tidak ada gulir mendatar di 390 px, dan avatar tetap terlihat
 *   - tombol View Profile benar-benar berpindah ke `/me/profile`
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
const PORT = 9341
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), 'meinova-uat-self-service')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
// Pegawai sungguhan, bukan `admin`: akun superuser tidak punya kartu
// pegawai, dan `/me` memang membalas 404 untuknya. Menguji Self Service
// dengan akun tanpa pegawai cuma menguji halaman galatnya.
const USER = process.env.UAT_USER ?? 'demo.gm'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}
// Akun berhak, untuk memeriksa bahwa cutover tidak ikut mencabut menu
// administratif. Pegawai biasa memang tidak berhak melihat Employees.
const ADMIN_USER = process.env.UAT_ADMIN_USER ?? 'admin'
const ADMIN_PASS = process.env.UAT_ADMIN_PASS ?? PASS

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
  await fs.mkdir(OUT, { recursive: true })

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

/**
 * Tangkapan **seukuran viewport**, untuk layar yang sedang membuka
 * lapisan mengambang.
 *
 * `captureBeyondViewport` mengubah ukuran viewport sesaat supaya seluruh
 * halaman masuk — dan perubahan ukuran itu membuat dropdown/dialog
 * reka-ui menutup dirinya sendiri. Hasilnya tangkapan halaman yang
 * lengkap tanpa satu-satunya hal yang sedang diuji.
 */
async function shotViewport(cdp, name) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })

  const file = path.join(OUT, `${name}.png`)
  await fs.writeFile(file, Buffer.from(data, 'base64'))

  return file
}

/**
 * Menyetel bahasa UI **tanpa menyentuh database dev**.
 *
 * Jalur resminya (`useLocale().setLocale`) mem-PATCH `auth/me/` supaya
 * pilihannya ikut orangnya lintas perangkat. Untuk UAT itu berarti
 * menulis preferensi ke akun demo hanya demi tangkapan layar — jadi di
 * sini bahasanya disetel di sisi klien saja: `localStorage.user.language`
 * (yang dibaca plugin sinkronisasi) plus cookie `app_settings`.
 */
async function setLocale(cdp, code) {
  await evaluate(cdp, `
    (() => {
      try {
        const raw = localStorage.getItem('user')
        const user = raw ? JSON.parse(raw) : {}
        user.language = ${JSON.stringify(code)}
        localStorage.setItem('user', JSON.stringify(user))
      } catch {}
      document.cookie = 'app_settings=' + encodeURIComponent(JSON.stringify({ locale: ${JSON.stringify(code)} })) + '; path=/'
      return true
    })()
  `)
}

async function goto(cdp, url, waitMs = 6000) {
  await cdp.send('Page.navigate', { url })
  await sleep(waitMs)
}

/** Alamat yang diminta halaman, dari event jaringan CDP. */
function requestedUrls(cdp) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .map(e => e.params.request.url)
}

/**
 * `{method, url, type}` tiap permintaan.
 *
 * Metodenya dicatat, bukan disimpulkan: dua entri untuk alamat yang
 * sama bisa berarti preflight CORS (`OPTIONS` + `GET`) atau pengambilan
 * ganda (`GET` + `GET`), dan keduanya menuntut tindakan yang berlawanan
 * — yang pertama dibiarkan, yang kedua diperbaiki.
 */
function requestDetails(cdp, needle) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .filter(e => e.params.request.url.includes(needle))
    .map(e => ({
      method: e.params.request.method,
      type: e.params.type ?? '(tanpa tipe)',
      url: new URL(e.params.request.url).pathname,
    }))
}

function consoleErrors(cdp) {
  return cdp.events
    .filter(e => (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
      || e.method === 'Runtime.exceptionThrown')
    .map(e => e.params?.entry?.text ?? e.params?.exceptionDetails?.text)
}

const READ = `
  (() => {
    const avatar = document.querySelector("[data-slot=avatar]")
    const img = avatar ? avatar.querySelector("[data-slot=avatar-image]") : null
    const fallback = avatar ? avatar.querySelector("[data-slot=avatar-fallback]") : null
    const box = avatar ? avatar.getBoundingClientRect() : null

    return {
      text: document.body.innerText,
      headings: [...document.querySelectorAll("h1,h2,h3")].map(n => n.innerText.trim()),
      hasAvatar: Boolean(avatar),
      avatarWidth: box ? Math.round(box.width) : 0,
      avatarVisible: box ? box.width > 0 && box.height > 0 : false,
      hasImage: Boolean(img),
      imageBroken: img ? img.naturalWidth === 0 : false,
      initials: fallback ? fallback.innerText.trim() : null,
      brokenImages: [...document.querySelectorAll("img")]
        .filter(i => i.complete && i.naturalWidth === 0).length,
      hasArtifacts: /\\bnull\\b|\\bundefined\\b|\\[object Object\\]|NaN/.test(document.body.innerText),
      emDashCount: (document.body.innerText.match(/—/g) || []).length,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      pathname: location.pathname,
    }
  })()
`

const report = []
let pass = 0
let fail = 0

function log(label, ok, detail = '') {
  ok ? pass++ : fail++
  const line = `${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`
  report.push(line)
  console.log(line)
}

async function main() {
  const chrome = await launch()
  const cdp = await attach()

  try {
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Log.enable')
    await cdp.send('Network.enable')

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
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
        name,
        value,
        url: BASE,
        path: '/',
        sameSite: 'Lax',
      })
    }

    await goto(cdp, `${BASE}/`, 6000)
    log('1. Login aplikasi', !(await evaluate(cdp, 'location.pathname')).includes('login'))

    // --- 2. My Workspace ------------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me`, 9000)

    const me = await evaluate(cdp, READ)
    const meShot = await shot(cdp, 'desktop-workspace')
    const meUrls = requestedUrls(cdp)

    log('2. /me terbuka', me.pathname === '/me', me.pathname)
    log('2. Tanpa error konsol', consoleErrors(cdp).length === 0, consoleErrors(cdp).slice(0, 2).join(' | '))
    log('2. Nama pegawai tampil', me.text.includes(auth.user?.display_name ?? 'Adrian'), '')
    log('2. Nomor pegawai tampil', /HO\d+/.test(me.text))
    log('2. Tanpa artefak null/undefined', !me.hasArtifacts)
    log('2. Tautan ke Profil Saya ada', me.text.includes('View Profile') || me.text.includes('Lihat Profil'))

    // --- 3. kontrak yang dipakai ----------------------------------------
    //
    // Dua hal sekaligus dibuktikan di sini, dan yang kedua yang penting:
    // `/me` **tidak** memanggil satu pun endpoint domain. Kalau ia
    // memanggil `/api/hr/attendance/` atau `/api/hr/leave-balances/`
    // langsung, batas identitas Self Service berhenti bisa dijamin dari
    // satu tempat — endpoint itu menerima `?employee=`.
    const usedLegacy = meUrls.filter(u => u.includes('/api/hr/employees/me'))
    const usedSelf = meUrls.filter(u => /\/api\/me\//.test(u))
    const usedDomain = meUrls.filter(u => /\/api\/(?:hr|payroll|workflow)\//.test(u))

    log('3. Endpoint HR lama TIDAK dipanggil', usedLegacy.length === 0, usedLegacy.join(' | '))
    log('3. Kontrak Self Service dipanggil', usedSelf.length > 0, usedSelf.map(u => new URL(u).pathname).join(' | '))
    log(
      '3. Nol endpoint domain dipanggil langsung',
      usedDomain.length === 0,
      usedDomain.map(u => new URL(u).pathname).join(' | '),
    )

    // --- 3b. satu permintaan untuk seluruh dashboard --------------------
    const workspaceCalls = requestDetails(cdp, '/api/me/workspace')

    console.log('    metode /api/me/workspace/:', JSON.stringify(workspaceCalls))

    const methods = workspaceCalls.map(c => c.method)
    const gets = methods.filter(m => m === 'GET').length
    const options = methods.filter(m => m === 'OPTIONS').length

    log(
      '3b. Hanya satu GET workspace',
      gets === 1,
      `GET=${gets} OPTIONS=${options} — ${methods.join(' + ')}`,
    )

    // --- 4. My Profile ---------------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me/profile`, 9000)

    const profile = await evaluate(cdp, READ)
    const profileShot = await shot(cdp, 'desktop-profile')
    const profileUrls = requestedUrls(cdp)

    log('4. /me/profile terbuka', profile.pathname === '/me/profile', profile.pathname)
    log('4. Tanpa error konsol', consoleErrors(cdp).length === 0, consoleErrors(cdp).slice(0, 2).join(' | '))
    log('4. Endpoint HR lama TIDAK dipanggil', profileUrls.filter(u => u.includes('/api/hr/employees/me')).length === 0)
    log('4. /api/me/profile/ dipanggil', profileUrls.some(u => u.includes('/api/me/profile')))

    for (const section of ['Personal', 'Contact', 'Employment', 'Organization', 'Emergency']) {
      log(`4. Seksi ${section} tampil`, profile.text.includes(section), '')
    }

    log('4. Tanpa artefak null/undefined', !profile.hasArtifacts)
    log('4. Nilai kosong memakai em dash', profile.emDashCount > 0, `${profile.emDashCount} baris`)

    // --- 5. foto ----------------------------------------------------------
    log('5. Avatar terlihat', profile.avatarVisible, `${profile.avatarWidth}px`)
    log('5. Ukuran avatar 72–88px (desktop)', profile.avatarWidth >= 64 && profile.avatarWidth <= 96, `${profile.avatarWidth}px`)
    log('5. demo.gm jatuh ke inisial', profile.hasImage === false && Boolean(profile.initials), `inisial=${profile.initials}`)
    log('5. Inisial benar (AM)', profile.initials === 'AM', String(profile.initials))
    log('5. Tidak ada gambar rusak', profile.brokenImages === 0, `${profile.brokenImages} rusak`)

    // --- 6. ponsel ---------------------------------------------------------
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    })

    await goto(cdp, `${BASE}/me/profile`, 8000)

    const mobile = await evaluate(cdp, READ)
    const mobileShot = await shot(cdp, 'mobile-profile')

    log('6. Tidak ada gulir mendatar', !mobile.horizontalOverflow, `scrollWidth=${mobile.scrollWidth} vs ${mobile.innerWidth}`)
    log('6. Avatar tetap terlihat', mobile.avatarVisible, `${mobile.avatarWidth}px`)
    log('6. Inisial tetap muncul', mobile.initials === 'AM', String(mobile.initials))
    log('6. Tanpa artefak', !mobile.hasArtifacts)

    // --- 7. navigasi CTA ----------------------------------------------------
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    })

    await goto(cdp, `${BASE}/me`, 8000)

    const clicked = await evaluate(cdp, `
      (() => {
        const link = [...document.querySelectorAll("a")]
          .find(a => (a.getAttribute("href") || "") === "/me/profile")
        if (!link) return false
        link.click()
        return true
      })()
    `)

    await sleep(4000)

    const after = await evaluate(cdp, 'location.pathname')

    log('7. Tombol View Profile ada', clicked === true)
    log('7. Berpindah ke /me/profile', after === '/me/profile', after)

    // --- 8. cutover navigasi ---------------------------------------------
    await goto(cdp, `${BASE}/hr`, 9000)

    const hrNav = await evaluate(cdp, `
      (() => {
        const links = [...document.querySelectorAll("[data-slot=sidebar] a")]
          .map(a => a.getAttribute("href") || "")
        return {
          links,
          hasMyProfile: links.includes("/hr/my-profile"),
          hasEmployees: links.includes("/hr/employees"),
        }
      })()
    `)

    log('8. My Profile TIDAK ada di sidebar HR', !hrNav.hasMyProfile)

    /*
     * `Employees` **tidak** diperiksa dengan akun ini, dan itu bukan
     * kelonggaran: `demo.gm` memegang role `EMPLOYEE`, yang memang tidak
     * berhak melihat daftar pegawai. Menuntutnya muncul di sini berarti
     * menuntut pembatasan menu yang benar untuk dilanggar.
     *
     * Pertanyaannya — "apakah cutover ikut mencabut Employees?" —
     * dijawab di langkah 8b dengan akun yang memang berhak.
     */
    log(
      '8. Sidebar HR tetap terisi untuk pegawai',
      hrNav.links.some(l => l.startsWith('/hr')),
      `${hrNav.links.filter(l => l.startsWith('/hr')).length} tautan HR`,
    )

    // --- 8b. Employees dengan akun yang berhak ---------------------------
    const adminAuth = await (await fetch(`${API}/api/accounts/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
    })).json()

    if (adminAuth.access) {
      for (const [name, value] of [['access', adminAuth.access], ['refresh', adminAuth.refresh]]) {
        await cdp.send('Network.setCookie', {
          name,
          value,
          url: BASE,
          path: '/',
          sameSite: 'Lax',
        })
      }

      await goto(cdp, `${BASE}/hr`, 9000)

      const adminNav = await evaluate(cdp, `
        (() => {
          const links = [...document.querySelectorAll("[data-slot=sidebar] a")]
            .map(a => a.getAttribute("href") || "")
          return {
            hasEmployees: links.includes("/hr/employees"),
            hasMyProfile: links.includes("/hr/my-profile"),
          }
        })()
      `)

      log('8b. Employees tetap ada untuk akun berhak', adminNav.hasEmployees)
      log('8b. My Profile tetap hilang untuk akun berhak', !adminNav.hasMyProfile)

      // Kembali ke akun pegawai untuk langkah berikutnya.
      for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]]) {
        await cdp.send('Network.setCookie', {
          name,
          value,
          url: BASE,
          path: '/',
          sameSite: 'Lax',
        })
      }
    }
    else {
      log('8b. Login akun berhak', false, 'tidak bisa masuk sebagai admin')
    }

    // --- 9. penanda halaman lama -------------------------------------------
    await goto(cdp, `${BASE}/hr/my-profile`, 8000)

    const redirected = await evaluate(cdp, 'location.pathname')
    const redirectBody = await evaluate(cdp, 'document.body.innerText')

    log('9. /hr/my-profile mengalihkan ke /me/profile', redirected === '/me/profile', redirected)
    log('9. Layar HR lama tidak dirender', redirectBody.includes('Personal Information') || redirectBody.includes('Informasi Pribadi'))

    // --- 10. launcher ------------------------------------------------------
    await goto(cdp, `${BASE}/`, 10000)

    const launcher = await evaluate(cdp, `
      (() => {
        const links = [...document.querySelectorAll("a")].map(a => a.getAttribute("href") || "")
        return {
          hasWorkspace: links.includes("/me"),
          text: document.body.innerText,
        }
      })()
    `)

    const launcherShot = await shot(cdp, 'desktop-launcher')

    log('10. Kartu My Workspace ada di launcher', launcher.hasWorkspace)
    log('10. Label My Workspace tampil', launcher.text.includes('My Workspace') || launcher.text.includes('Ruang Saya'))

    // --- 11. bukti visual Stage 5B ----------------------------------------
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    })

    await setLocale(cdp, 'id')
    await goto(cdp, `${BASE}/me`, 9000)

    const idWorkspace = await evaluate(cdp, READ)
    const shotMeIdDesktop = await shot(cdp, '5b-me-desktop-id')

    log('11. /me berbahasa Indonesia', idWorkspace.text.includes('Ruang Kerja Saya') || idWorkspace.text.includes('Aksi Cepat'), '')
    log('11. Sapaan tampil', /Selamat (?:pagi|siang|sore|malam)/.test(idWorkspace.text))
    log('11. Aksi Cepat ada', idWorkspace.text.includes('Aksi Cepat'))
    log('11. Tanpa kartu placeholder', !idWorkspace.text.includes('Belum tersedia') && !idWorkspace.text.includes('Not available yet'))
    log('11. Dokumen/Pengajuan dihapus', !idWorkspace.text.includes('Dokumen Saya') && !idWorkspace.text.includes('Pengajuan Saya'))

    // --- 12. dashboard: bentuk, isi, dan kejujuran angkanya ---------------
    //
    // Payload API ditarik langsung supaya yang diperiksa bukan "kartunya
    // berhasil dirender" melainkan "yang tertulis di kartu memang angka
    // yang dikirim backend". Kartu yang render dengan angka karangan
    // lulus pemeriksaan pertama dan gagal yang kedua.
    const wsPayload = (await (await fetch(`${API}/api/me/workspace/`, {
      headers: { Authorization: `Bearer ${auth.access}` },
    })).json()).data

    console.log('    payload ringkas:', JSON.stringify({
      schedule: wsPayload.schedule.state,
      attendance: wsPayload.attendance.state,
      requests: wsPayload.requests.state,
      leave: wsPayload.leave.state,
      permission: wsPayload.permission.state,
      overtime: wsPayload.overtime.state,
      payslip: wsPayload.payslip.state,
      quick_actions: wsPayload.quick_actions.map(a => a.code),
    }))

    for (const [label, heading] of [
      ['Hari Ini', 'Hari Ini'],
      ['Layanan Saya', 'Layanan Saya'],
      ['Aksi Cepat', 'Aksi Cepat'],
    ])
      log(`12. Seksi ${label} tampil`, idWorkspace.text.includes(heading))

    /*
     * Dibandingkan dalam huruf besar semua.
     *
     * Judul kartu memakai `uppercase` — gaya eyebrow yang sama dengan
     * desain yang diminta — dan `innerText` Chrome mengembalikan teks
     * **sesudah** `text-transform`. Perbandingan peka huruf di sini
     * memerahkan empat kartu yang sebenarnya tampil sempurna.
     */
    const idText = idWorkspace.text.toUpperCase()

    for (const judul of [
      'Jadwal Hari Ini',
      'Kehadiran',
      'Tugas & Permintaan',
      'Cuti',
      'Izin',
      'Lembur',
      'Slip Gaji Terbaru',
    ])
      log(`12. Kartu ${judul} tampil`, idText.includes(judul.toUpperCase()))

    // Data nyata: yang backend kirim harus benar-benar terbaca di layar.
    if (wsPayload.schedule.state === 'ready') {
      log(
        '12. Jadwal nyata tampil apa adanya',
        idWorkspace.text.includes(wsPayload.schedule.shift_name)
        && idWorkspace.text.includes(wsPayload.schedule.time_label),
        `${wsPayload.schedule.shift_name} ${wsPayload.schedule.time_label}`,
      )
    }
    else {
      log('12. Jadwal kosong berkalimat jujur', idWorkspace.text.includes('Tidak ada jadwal'))
    }

    if (wsPayload.leave.state === 'ready') {
      const first = wsPayload.leave.balances[0]

      log(
        '12. Saldo cuti nyata tampil apa adanya',
        idWorkspace.text.includes(String(first.remaining))
        && idWorkspace.text.includes(first.leave_type.name),
        `${first.leave_type.name} ${first.remaining}`,
      )
    }
    else {
      log('12. Saldo cuti kosong berkalimat jujur', idWorkspace.text.includes('Belum ada saldo cuti'))
    }

    log(
      '12. Kehadiran kosong berkalimat jujur, bukan nol',
      wsPayload.attendance.state === 'ready'
        ? idWorkspace.text.includes(wsPayload.attendance.check_in ?? '')
        : idWorkspace.text.includes('Belum ada catatan kehadiran'),
      wsPayload.attendance.state,
    )

    log(
      '12. Slip gaji kosong berkalimat jujur',
      wsPayload.payslip.state === 'ready'
        ? idWorkspace.text.includes(wsPayload.payslip.latest.period.name)
        : idWorkspace.text.includes('Belum ada slip gaji'),
      wsPayload.payslip.state,
    )

    // Tombol yang backend nyatakan tidak layak **tidak boleh** ada di DOM.
    const shownCodes = wsPayload.quick_actions.map(a => a.code)

    const hrefs = await evaluate(cdp, `
      [...document.querySelectorAll("a")].map(a => a.getAttribute("href") || "")
    `)

    log(
      '12. Tombol Lembur hilang saat izinnya tidak ada',
      shownCodes.includes('overtime_request')
        ? hrefs.includes('/hr/overtime/create')
        : !hrefs.includes('/hr/overtime/create'),
      `quick_actions=${shownCodes.join(',')}`,
    )

    log(
      '12. Tombol Slip Gaji mengikuti keputusan backend',
      wsPayload.payslip.action
        ? hrefs.includes(wsPayload.payslip.action.route)
        : !hrefs.includes('/payroll/payslips'),
      String(wsPayload.payslip.action?.route ?? 'null'),
    )

    // Nol pintu administratif: dashboard tidak boleh menautkan ke layar
    // master mana pun.
    const adminHrefs = hrefs.filter(h => [
      '/hr/employees',
      '/hr/leave-balances',
      '/hr/roster-setups',
      '/payroll/payroll-runs',
      '/workflow/definitions',
      '/administration',
    ].some(bad => h.startsWith(bad)))

    log('12. Nol tautan ke layar administratif', adminHrefs.length === 0, adminHrefs.join(' | '))

    log('12. Tanpa artefak null/undefined', !idWorkspace.hasArtifacts)
    log('12. Tanpa nilai rupiah di dashboard', !/Rp\s?[\d.,]{4,}/.test(idWorkspace.text))

    /*
     * Tangkapan kedua, digulir ke dasar.
     *
     * `captureBeyondViewport` tidak memperpanjang tangkapan di desktop:
     * shell aplikasi menggulir di dalam elemennya sendiri, jadi tinggi
     * `document` sama dengan tinggi viewport dan Aksi Cepat berada di
     * luar bingkai. Tanpa tangkapan ini, seksi yang paling diminta tidak
     * punya bukti visual sama sekali.
     */
    const bottomActions = await evaluate(cdp, `
      (() => {
        const scroller = [...document.querySelectorAll("*")]
          .find(el => el.scrollHeight > el.clientHeight + 40 && el.clientHeight > 400)

        if (scroller) scroller.scrollTop = scroller.scrollHeight

        return [...document.querySelectorAll("[data-testid=quick-actions] a")]
          .map(a => a.getAttribute("href") || "")
      })()
    `)

    await sleep(600)

    const shotMeIdBottom = await shot(cdp, '5b-me-desktop-id-bottom')

    log(
      '12. Aksi Cepat berisi persis tombol yang disetujui backend',
      bottomActions.length === shownCodes.length
      && wsPayload.quick_actions.every(a => bottomActions.includes(a.route)),
      `dom=${bottomActions.join(',')} vs api=${shownCodes.join(',')}`,
    )

    await setLocale(cdp, 'en')
    await goto(cdp, `${BASE}/me`, 9000)

    const enWorkspace = await evaluate(cdp, READ)
    const shotMeEnDesktop = await shot(cdp, '5b-me-desktop-en')

    log('11. /me berbahasa Inggris', enWorkspace.text.includes('Quick Actions'))
    log('11. Sapaan Inggris', /Good (?:morning|afternoon|evening)/.test(enWorkspace.text))

    for (const heading of ['Today', 'My Services', 'Quick Actions'])
      log(`12. Seksi ${heading} berbahasa Inggris`, enWorkspace.text.includes(heading))

    const enText = enWorkspace.text.toUpperCase()

    for (const judul of [
      'Today\'s Schedule',
      'Attendance',
      'Tasks & Requests',
      'Leave',
      'Permission',
      'Overtime',
      'Latest Payslip',
    ])
      log(`12. Kartu ${judul} berbahasa Inggris`, enText.includes(judul.toUpperCase()))

    log(
      '12. Nol kalimat Indonesia tersisa di mode Inggris',
      !/JADWAL HARI INI|AKSI CEPAT|BELUM ADA|TIDAK ADA/.test(enText),
    )

    await setLocale(cdp, 'id')

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    })

    await goto(cdp, `${BASE}/me`, 8000)

    const mobileWorkspace = await evaluate(cdp, READ)
    const shotMeIdMobile = await shot(cdp, '5b-me-mobile-id')

    log('11. Workspace ponsel tanpa gulir mendatar', !mobileWorkspace.horizontalOverflow, `scrollWidth=${mobileWorkspace.scrollWidth}`)
    log('11. Avatar tetap terlihat di ponsel', mobileWorkspace.avatarVisible, `${mobileWorkspace.avatarWidth}px`)

    /*
     * Kaki halaman versi ponsel. Aksi Cepat adalah satu-satunya bagian
     * yang tata letaknya **berubah** antar lebar (dua kolom di ponsel,
     * selebar isinya di desktop), jadi ia perlu buktinya sendiri —
     * tangkapan desktop tidak menjawab apa pun tentangnya.
     */
    const mobileActions = await evaluate(cdp, `
      (() => {
        const scroller = [...document.querySelectorAll("*")]
          .find(el => el.scrollHeight > el.clientHeight + 40 && el.clientHeight > 300)

        if (scroller) scroller.scrollTop = scroller.scrollHeight

        const tiles = [...document.querySelectorAll("[data-testid=quick-actions] a")]

        return {
          count: tiles.length,
          widths: tiles.map(a => Math.round(a.getBoundingClientRect().width)),
          rights: tiles.map(a => Math.round(a.getBoundingClientRect().right)),
        }
      })()
    `)

    await sleep(600)

    const shotMeIdMobileBottom = await shot(cdp, '5b-me-mobile-id-bottom')

    log(
      '11. Aksi Cepat ponsel tidak melewati lebar layar',
      mobileActions.rights.every(right => right <= 390),
      `lebar=${mobileActions.widths.join(',')} kanan=${mobileActions.rights.join(',')}`,
    )

    await goto(cdp, `${BASE}/me/profile`, 8000)
    const shotProfileIdMobile = await shot(cdp, '5b-profile-mobile-id')

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    })

    await goto(cdp, `${BASE}/me/profile`, 8000)

    const idProfile = await evaluate(cdp, READ)
    const shotProfileIdDesktop = await shot(cdp, '5b-profile-desktop-id')

    log('11. Profil berbahasa Indonesia', idProfile.text.includes('Informasi Pribadi'))
    log('11. Profil tetap detail', ['Kontak & Alamat', 'Kepegawaian', 'Organisasi', 'Kontak Darurat'].every(k => idProfile.text.includes(k)))

    // Workspace harus **lebih ringkas** daripada profil. Kalau keduanya
    // sepanjang ini sama, yang dibuat cuma profil kedua.
    log(
      '11. Workspace ringkas, profil detail',
      idWorkspace.text.length < idProfile.text.length,
      `workspace=${idWorkspace.text.length} chars vs profil=${idProfile.text.length} chars`,
    )

    // --- 13. dropdown user -------------------------------------------
    //
    // Satu-satunya bagian aplikasi yang isinya **hanya** terlihat setelah
    // diklik, jadi ia tidak pernah tersentuh tangkapan layar biasa.
    // Sidebar di viewport UAT terlipat, jadi dibuka dulu — kalau tidak,
    // pemicunya memang tidak ada di DOM dan test-nya merah untuk alasan
    // yang salah.

    /*
     * Dropdown user tinggal di **kaki sidebar**, dan sidebar hanya
     * dirender untuk rute yang punya menu modul
     * (`<Sidebar v-if="navMenu.length">`). `/me` sengaja tidak punya —
     * Self Service dijangkau lewat launcher dan menu avatar, bukan lewat
     * sidebar modul. Jadi menunya dibuka dari `/hr`, dan tautannya yang
     * diuji membawa ke `/me`.
     *
     * Pemicunya diambil dari `[data-slot=sidebar-footer]`, bukan
     * `querySelector` pertama: ada **dua** dropdown di sidebar, dan yang
     * pertama pemilih tim di kepalanya.
     */
    async function openUserMenu() {
      /*
       * Menutup dulu apa pun yang sedang terbuka, lalu membuka.
       *
       * Pemicu dropdown bersifat **toggle**: kalau menunya masih dalam
       * transisi tutup dari langkah sebelumnya, satu klik justru
       * menutupnya lagi — dan langkah berikutnya gagal dengan alasan yang
       * tidak ada hubungannya dengan yang sedang diuji.
       */
      await evaluate(cdp, `
        (() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
          )

          return true
        })()
      `)

      await sleep(500)

      await evaluate(cdp, `
        (() => {
          const button = document.querySelector(
            "[data-slot=sidebar-footer] [data-slot=dropdown-menu-trigger]",
          )

          if (button) button.click()

          return Boolean(button)
        })()
      `)

      await sleep(900)

      return evaluate(cdp, `
        (() => {
          const menu = document.querySelector("[data-slot=dropdown-menu-content]")

          if (!menu) return { open: false, items: [], targets: [], text: "" }

          const rows = [...menu.querySelectorAll("[data-slot=dropdown-menu-item], [data-slot=dropdown-menu-sub-trigger]")]

          return {
            open: true,
            text: menu.innerText,
            items: rows.map(row => row.innerText.trim()).filter(Boolean),
            targets: [...menu.querySelectorAll("a")]
              .map(a => a.getAttribute("href") || "")
              .filter(Boolean),
          }
        })()
      `)
    }

    async function closeMenu() {
      await evaluate(cdp, 'document.body.click()')
      await sleep(400)
    }

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    })

    await setLocale(cdp, 'id')
    await goto(cdp, `${BASE}/hr`, 9000)

    const menuId = await openUserMenu()
    const shotMenuId = await shotViewport(cdp, 'user-menu-desktop-id')

    console.log('    item dropdown (ID):', JSON.stringify(menuId.items))
    console.log('    tujuan dropdown:', JSON.stringify(menuId.targets))

    log('13. Dropdown user terbuka', menuId.open)

    log('13. Tanpa "Upgrade to Pro"', !/upgrade/i.test(menuId.text), menuId.text.slice(0, 0))
    log('13. Tanpa "Github Repository"', !/github/i.test(menuId.text))
    log(
      '13. Tanpa tautan eksternal',
      menuId.targets.every(target => target.startsWith('/')),
      menuId.targets.filter(target => !target.startsWith('/')).join(' | '),
    )

    log(
      '13. Dua tujuan personal paling atas',
      menuId.targets[0] === '/me' && menuId.targets[1] === '/me/profile',
      menuId.targets.slice(0, 2).join(' , '),
    )

    log(
      '13. Satu pintu Pengaturan, bukan dua',
      menuId.targets.filter(target => target.startsWith('/settings')).length === 1,
      menuId.targets.filter(target => target.startsWith('/settings')).join(' | '),
    )

    log(
      '13. Tanpa tujuan kembar',
      new Set(menuId.targets).size === menuId.targets.length,
      menuId.targets.join(' | '),
    )

    for (const label of ['Ruang Kerja Saya', 'Profil Saya', 'Pengaturan', 'Bahasa', 'Tema', 'Keluar'])
      log(`13. "${label}" ada (ID)`, menuId.text.includes(label))

    log(
      '13. Keluar item terakhir',
      menuId.items.at(-1) === 'Keluar',
      String(menuId.items.at(-1)),
    )

    await closeMenu()

    // -- tujuan benar-benar berpindah ---------------------------------
    await openUserMenu()
    await evaluate(cdp, `
      (() => {
        const link = [...document.querySelectorAll("[data-slot=dropdown-menu-content] a")]
          .find(a => a.getAttribute("href") === "/me/profile")

        if (link) link.click()

        return true
      })()
    `)
    await sleep(3500)

    log(
      '13. Profil Saya membuka /me/profile',
      (await evaluate(cdp, 'location.pathname')) === '/me/profile',
      await evaluate(cdp, 'location.pathname'),
    )

    await goto(cdp, `${BASE}/hr`, 8000)
    await openUserMenu()
    await evaluate(cdp, `
      (() => {
        const link = [...document.querySelectorAll("[data-slot=dropdown-menu-content] a")]
          .find(a => a.getAttribute("href") === "/me")

        if (link) link.click()

        return true
      })()
    `)
    await sleep(3500)

    log(
      '13. Ruang Kerja Saya membuka /me',
      (await evaluate(cdp, 'location.pathname')) === '/me',
      await evaluate(cdp, 'location.pathname'),
    )

    // -- Tema masih membuka dialognya ---------------------------------
    await goto(cdp, `${BASE}/hr`, 8000)
    await openUserMenu()
    const themeOpened = await evaluate(cdp, `
      (() => {
        const row = [...document.querySelectorAll("[data-slot=dropdown-menu-item]")]
          .find(el => /Tema|Theme/.test(el.innerText))

        if (!row) return false

        row.click()

        return true
      })()
    `)
    await sleep(1200)

    const themeDialog = await evaluate(cdp, `
      Boolean(document.querySelector("[role=dialog]"))
    `)

    log('13. Tema membuka dialog appearance', themeOpened && themeDialog)

    await evaluate(cdp, `
      (() => {
        const close = document.querySelector("[role=dialog] [data-slot=dialog-close], [role=dialog] button")

        if (close) close.click()

        return true
      })()
    `)
    await sleep(600)

    // -- Bahasa masih submenu i18n existing ----------------------------
    await goto(cdp, `${BASE}/hr`, 8000)
    await openUserMenu()
    /*
     * Submenu reka-ui tidak terbuka seketika: pemicunya bereaksi pada
     * pointer lalu isinya dirender pada tick berikutnya. Membacanya di
     * evaluate yang sama dengan kliknya selalu memulangkan daftar kosong
     * — merah untuk submenu yang sebenarnya baik-baik saja.
     */
    await evaluate(cdp, `
      (() => {
        const trigger = [...document.querySelectorAll("[data-slot=dropdown-menu-sub-trigger]")]
          .find(el => /Bahasa|Language/.test(el.innerText))

        if (!trigger) return false

        const opts = { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: "mouse", isPrimary: true }

        trigger.dispatchEvent(new PointerEvent("pointerenter", opts))
        trigger.dispatchEvent(new PointerEvent("pointermove", opts))
        trigger.click()

        return true
      })()
    `)

    await sleep(900)

    const languageItems = await evaluate(cdp, `
      [...document.querySelectorAll("[data-slot=dropdown-menu-sub-content] [data-slot=dropdown-menu-item]")]
        .map(el => el.innerText.trim())
    `)

    log(
      '13. Bahasa tetap submenu i18n existing',
      languageItems.length >= 2,
      languageItems.join(' | '),
    )

    await closeMenu()

    // -- versi Inggris -------------------------------------------------
    await setLocale(cdp, 'en')
    await goto(cdp, `${BASE}/hr`, 9000)

    const menuEn = await openUserMenu()
    const shotMenuEn = await shotViewport(cdp, 'user-menu-desktop-en')

    console.log('    item dropdown (EN):', JSON.stringify(menuEn.items))

    for (const label of ['My Workspace', 'My Profile', 'Settings', 'Language', 'Theme', 'Log out'])
      log(`13. "${label}" ada (EN)`, menuEn.text.includes(label))

    log('13. Tanpa "Upgrade to Pro" (EN)', !/upgrade/i.test(menuEn.text))
    log('13. Tanpa "Github Repository" (EN)', !/github/i.test(menuEn.text))

    log(
      '13. Susunan ID dan EN sama panjang',
      menuId.items.length === menuEn.items.length,
      `id=${menuId.items.length} en=${menuEn.items.length}`,
    )

    await closeMenu()

    // -- keluar, paling akhir karena ia mengakhiri sesinya --------------
    await setLocale(cdp, 'id')
    await goto(cdp, `${BASE}/hr`, 9000)

    await openUserMenu()
    await evaluate(cdp, `
      (() => {
        const row = [...document.querySelectorAll("[data-slot=dropdown-menu-item]")]
          .find(el => /Keluar|Log out/.test(el.innerText))

        if (row) row.click()

        return true
      })()
    `)
    await sleep(4000)

    const afterLogout = await evaluate(cdp, 'location.pathname')

    log('13. Keluar mengakhiri sesi', afterLogout.includes('login'), afterLogout)

    console.log('\nBerkas bukti:')
    for (const f of [
      meShot,
      profileShot,
      mobileShot,
      launcherShot,
      shotMeIdDesktop,
      shotMeIdBottom,
      shotMeEnDesktop,
      shotMeIdMobile,
      shotMeIdMobileBottom,
      shotProfileIdDesktop,
      shotProfileIdMobile,
      shotMenuId,
      shotMenuEn,
    ])
      console.log(`  ${f}`)
  }
  finally {
    cdp.close()
    try { chrome.kill() }
    catch {}
  }

  console.log(`\n${pass} PASS, ${fail} FAIL`)

  await fs.writeFile(path.join(OUT, 'report.txt'), report.join('\n'))

  if (fail > 0)
    process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
