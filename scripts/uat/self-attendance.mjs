/*
 * UAT browser — `/me/attendance` (Kehadiran Saya).
 *
 * Pola yang sama dengan `self-service.mjs`: Chrome headless lewat CDP,
 * tanpa Playwright, memakai paket `ws` yang sudah ada.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/self-attendance.mjs
 *
 * **Akunnya Bimo (`demo.hostaff`, HO003), bukan `demo.gm`.** Ia yang
 * punya presensi sungguhan di tenant dev: 19 baris pada Agustus 2026,
 * termasuk hari terlambat dan hari mangkir. Tidak ada satu baris pun
 * yang dibuat untuk UAT ini.
 *
 * Yang diperiksa:
 *   - rentang bawaan 7 hari, dan ia **tidak** menarik seluruh histori
 *   - preset 30 hari dan rentang kustom mengubah ringkasan DAN tabel
 *   - paginasi server-side: 19 baris jadi 2 halaman, isinya tidak
 *     bertumpang tindih, dan yang dikirim `?page=`
 *   - terbaru dahulu
 *   - hanya data Bimo — nomor pegawai lain tidak pernah muncul
 *   - CTA di `/me` menuju `/me/attendance`, bukan `/hr/attendance`
 *   - permintaan **tidak pernah** menyentuh `/api/hr/attendance`
 *   - ID, EN, gelap, terang, dan 390 px tanpa gulir mendatar
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
const PORT = 9342
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), 'meinova-uat-attendance')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'demo.hostaff'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}

// Agustus 2026 — bulan yang memang berisi 19 baris presensi Bimo di
// tenant dev. Tidak diketik sebagai tanggal di sini: hari ini 16
// September 2026, jadi preset "Bulan Lalu" jatuh tepat ke sana. Itu
// menguji presetnya sekaligus, alih-alih melewatinya.

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
    '--window-size=1600,1200',
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

/**
 * Mode gelap disetel **di sisi klien**, seperti bahasa.
 *
 * `@nuxtjs/color-mode` membaca `localStorage.nuxt-color-mode` dan
 * menempelkan kelasnya ke `<html>`. Menyetel kelasnya saja tidak cukup:
 * plugin color-mode menimpanya saat hidrasi berikutnya.
 */
async function setTheme(cdp, mode) {
  await evaluate(cdp, `
    (() => {
      try { localStorage.setItem('nuxt-color-mode', ${JSON.stringify(mode)}) } catch {}
      document.documentElement.classList.toggle('dark', ${mode === 'dark'})
      document.documentElement.style.colorScheme = ${JSON.stringify(mode)}
      return true
    })()
  `)
}

async function viewport(cdp, width, height, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  })
}

async function goto(cdp, url, waitMs = 7000) {
  await cdp.send('Page.navigate', { url })
  await sleep(waitMs)
}

/**
 * Kunjungan pemanasan, **wajib sebelum pemeriksaan apa pun**.
 *
 * Nuxt dev mengompilasi rute dan komponennya pada kunjungan pertama.
 * Untuk halaman ini kompilasinya melewati dua belas detik, dan
 * akibatnya bukan galat melainkan skeleton yang masih terpasang saat
 * tangkapan layar diambil — seluruh pemeriksaan isi gagal dengan
 * "0 petak", "0 baris", "label EN tidak ada". Kegagalan yang persis
 * seperti halaman rusak, padahal yang kurang cuma waktu.
 */
async function warm(cdp, routes) {
  for (const route of routes) {
    await cdp.send('Page.navigate', { url: `${BASE}${route}` })
    await sleep(15000)
  }
}

function requested(cdp, needle) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .map(e => e.params.request.url)
    .filter(url => url.includes(needle))
}

function consoleErrors(cdp) {
  return cdp.events
    .filter(e => (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
      || e.method === 'Runtime.exceptionThrown')
    .map(e => e.params?.entry?.text ?? e.params?.exceptionDetails?.text)
    // Kegagalan memuat favicon bukan kegagalan halaman.
    .filter(text => text && !/favicon/i.test(text))
}

/** Pembacaan halaman: ringkasan, strip harian, tabel, paginasi. */
const READ = `
  (() => {
    const rows = [...document.querySelectorAll("[data-testid=history-table] tbody tr")]
      .map(tr => [...tr.querySelectorAll("td")].map(td => td.innerText.trim()))

    const metric = key => {
      const el = document.querySelector("[data-testid=metric-" + key + "]")
      return el ? el.innerText.trim() : null
    }

    const strip = [...document.querySelectorAll("[data-testid=day-strip] > div")]

    const label = document.querySelector("[data-testid=period-label]")

    return {
      pathname: location.pathname,
      periodLabel: label ? label.innerText.trim() : null,
      text: document.body.innerText,
      headings: [...document.querySelectorAll("h1,h2,h3")].map(n => n.innerText.trim()),
      metrics: {
        workDays: metric("workDays"),
        present: metric("present"),
        late: metric("late"),
        absent: metric("absent"),
        leave: metric("leave"),
        workedHours: metric("workedHours"),
        overtime: metric("overtime"),
      },
      stripCount: strip.length,
      stripOutcomes: strip.reduce((acc, el) => {
        const key = el.getAttribute("data-outcome")
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {}),
      rowCount: rows.length,
      firstRow: rows[0] || null,
      dates: rows.map(r => r[0]),
      hasTable: Boolean(document.querySelector("[data-testid=history-table]")),
      hasCards: Boolean(document.querySelector("[data-testid=history-cards]")),
      tableVisible: (() => {
        const el = document.querySelector("[data-testid=history-table]")
        return el ? el.getBoundingClientRect().height > 0 : false
      })(),
      cardsVisible: (() => {
        const el = document.querySelector("[data-testid=history-cards]")
        return el ? el.getBoundingClientRect().height > 0 : false
      })(),
      emptyHistory: Boolean(document.querySelector("[data-testid=history-empty]")),
      nextDisabled: (() => {
        const el = document.querySelector("[data-testid=page-next]")
        return el ? el.disabled : null
      })(),
      prevDisabled: (() => {
        const el = document.querySelector("[data-testid=page-prev]")
        return el ? el.disabled : null
      })(),
      hasArtifacts: /\\bnull\\b|\\bundefined\\b|\\[object Object\\]|NaN/.test(document.body.innerText),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }
  })()
`

/**
 * Menunggu **kondisi**, bukan sejumlah detik.
 *
 * Tidur berdurasi tetap adalah sumber kegagalan palsu yang paling
 * mahal di UAT ini: Nuxt dev plus Django dev kadang butuh sedetik,
 * kadang delapan, dan `sleep(2500)` menghasilkan "0 baris" yang
 * terbaca persis seperti halaman rusak. Yang ditunggu di sini keadaan
 * yang memang ditunggu orang yang memakainya.
 */
async function waitFor(cdp, expression, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    if (await evaluate(cdp, `Boolean(${expression})`))
      return true

    await sleep(400)
  }

  return false
}

/** Halaman sudah selesai memuat datanya. */
const LOADED = 'document.querySelector("[data-testid=attendance-summary]")'

/**
 * Ketukan **tetikus sungguhan** pada titik tengah sebuah elemen.
 *
 * `element.click()` cuma melepas satu `MouseEvent` bertipe `click`;
 * kalender reka-ui menyusun rentangnya dari urutan pointer yang utuh,
 * jadi ketukan sintetis mendaftar sebagai ujung awal lalu berhenti di
 * situ — rentangnya punya awal tanpa akhir, dan tombol Terapkan diam
 * karena memang tidak ada rentang lengkap untuk diterapkan.
 */
async function mouseClick(cdp, expression) {
  const box = await evaluate(cdp, `
    (() => {
      const el = ${expression}

      if (!el) return null

      const r = el.getBoundingClientRect()

      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }
    })()
  `)

  if (!box)
    return false

  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x: box.x,
      y: box.y,
      button: 'left',
      clickCount: 1,
    })
  }

  return true
}

async function click(cdp, selector) {
  const ok = await evaluate(cdp, `
    (() => {
      const el = document.querySelector(${JSON.stringify(selector)})
      if (!el) return false
      el.click()
      return true
    })()
  `)

  await sleep(600)

  return ok
}

/**
 * Menekan sesuatu lalu menunggu **periodenya benar-benar berganti**.
 *
 * Membandingkan label periode sebelum dan sesudah, bukan menghitung
 * detik: satu permintaan yang lambat sedetik tidak boleh membuat
 * seluruh pemeriksaan sesudahnya membaca layar yang belum berubah.
 */
async function clickAndWait(cdp, selector) {
  const before = await evaluate(cdp, `
    (() => {
      const el = document.querySelector("[data-testid=period-label]")
      return el ? el.innerText.trim() : ""
    })()
  `)

  const hit = await click(cdp, selector)

  if (!hit)
    return false

  await waitFor(cdp, `
    (() => {
      const el = document.querySelector("[data-testid=period-label]")
      return el && el.innerText.trim() !== ${JSON.stringify(before)}
    })()
  `)

  return true
}

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
  const shots = []

  try {
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Log.enable')
    await cdp.send('Network.enable')

    await viewport(cdp, 1600, 1200)

    /*
     * Login, dan **bisa dipanggil ulang**.
     *
     * UAT ini berjalan belasan menit; masa berlaku access token lebih
     * pendek dari itu. Tanpa penyegaran di tengah jalan, langkah-langkah
     * terakhir gagal dengan 401 yang terbaca persis seperti halaman
     * rusak — padahal yang kedaluwarsa cuma tiketnya.
     */
    async function login() {
      const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: USER, password: PASS }),
      })).json()

      if (!auth.access)
        throw new Error(`Login API gagal: ${JSON.stringify(auth)}`)

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

    // --- 1. login -----------------------------------------------------
    await goto(cdp, `${BASE}/`, 3000)
    await login()

    await setLocale(cdp, 'id')
    await setTheme(cdp, 'light')
    await goto(cdp, `${BASE}/`, 6000)

    log('1. Login sebagai Bimo', !(await evaluate(cdp, 'location.pathname')).includes('login'))

    // Pemanasan sebelum apa pun diukur — lihat catatan pada `warm()`.
    await warm(cdp, ['/me', '/me/attendance'])

    // --- 2. CTA di /me menuju Self Service, bukan meja admin ----------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me`, 4000)
    // Yang dinilai tautannya, jadi tautannya yang ditunggu — bukan
    // seksi lain yang kebetulan tampil lebih dulu.
    await waitFor(cdp, 'document.querySelector("a[href=\'/me/attendance\']")')

    const cta = await evaluate(cdp, `
      (() => {
        const links = [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href"))
        return {
          toSelf: links.includes("/me/attendance"),
          toAdmin: links.includes("/hr/attendance"),
        }
      })()
    `)

    log('2. CTA Kehadiran menuju /me/attendance', cta.toSelf)
    log('2. CTA Kehadiran TIDAK menuju /hr/attendance', !cta.toAdmin)

    // --- 3. rentang bawaan -------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me/attendance`, 4000)

    log('3. Halaman selesai memuat datanya', await waitFor(cdp, LOADED))

    const base = await evaluate(cdp, READ)
    shots.push(await shot(cdp, 'attendance-default-id'))

    log('3. /me/attendance terbuka', base.pathname === '/me/attendance', base.pathname)
    log('3. Tanpa error konsol', consoleErrors(cdp).length === 0, consoleErrors(cdp).slice(0, 2).join(' | '))
    log('3. Tanpa artefak null/undefined', !base.hasArtifacts)
    log('3. Judul halaman tampil', base.text.includes('Kehadiran Saya'))

    const defaultCalls = requested(cdp, '/api/me/attendance')

    log('3. Memanggil endpoint Self Service', defaultCalls.length > 0, `${defaultCalls.length} panggilan`)
    log(
      '3. Bawaan tanpa parameter rentang (backend yang menetapkan 7 hari)',
      defaultCalls.every(url => !url.includes('date_from')),
      defaultCalls[0] ?? '',
    )
    log('3. Strip harian 7 petak', base.stripCount === 7, String(base.stripCount))
    log(
      '3. Bawaan tidak menarik seluruh histori',
      base.rowCount <= 10,
      `${base.rowCount} baris`,
    )

    // --- 4. tidak pernah menyentuh endpoint HR ------------------------
    log(
      '4. Tidak memanggil /api/hr/attendance',
      requested(cdp, '/api/hr/attendance').length === 0,
      requested(cdp, '/api/hr/attendance').join(' '),
    )
    log(
      '4. Tidak mengirim parameter identitas',
      !requested(cdp, '/api/me/attendance').some(u => /employee|user=/.test(u)),
    )

    // --- 5. preset 30 hari -------------------------------------------
    cdp.events.length = 0
    await clickAndWait(cdp, '[data-testid=preset-last30]')

    const d30 = await evaluate(cdp, READ)

    log('5. Preset 30 Hari terpakai', d30.stripCount === 30, `${d30.stripCount} petak`)
    log(
      '5. Rentang dikirim ke backend',
      requested(cdp, '/api/me/attendance').some(u => u.includes('date_from')),
    )
    log(
      '5. Ringkasan ikut berubah, bukan cuma tabel',
      d30.metrics.workDays !== base.metrics.workDays,
      `${base.metrics.workDays} → ${d30.metrics.workDays}`,
    )

    // --- 6. Bulan Lalu = Agustus 2026, bulan berisi data Bimo ---------
    //
    // Hari ini 16 September 2026, jadi preset "Bulan Lalu" jatuh tepat
    // pada 1–31 Agustus 2026 — bulan yang memang berisi 19 baris
    // presensi Bimo di tenant dev. Tidak ada satu baris pun yang dibuat
    // untuk UAT ini.
    cdp.events.length = 0
    await clickAndWait(cdp, '[data-testid=preset-lastMonth]')
    await waitFor(cdp, 'document.querySelectorAll("[data-testid=history-table] tbody tr").length > 0')

    const aug = await evaluate(cdp, READ)

    shots.push(await shot(cdp, 'attendance-august-id'))

    log('6. Periode Agustus 2026 terbuka', /Agustus 2026/.test(aug.periodLabel ?? ''), aug.periodLabel ?? '')
    log('6. Strip harian 31 petak', aug.stripCount === 31, `${aug.stripCount} petak`)

    // Angka-angka di bawah **bukan tebakan**: keduanya dihitung
    // `HRPeriodSummaryService` dari data dev yang sama, dan diperiksa
    // lewat shell sebelum UAT ini ditulis.
    for (const [key, expected] of [
      ['workDays', '20'],
      ['present', '18'],
      ['late', '5'],
      ['absent', '2'],
    ]) {
      log(
        `6. ${key} = ${expected} (sesuai perhitungan kanonik)`,
        aug.metrics[key] === expected,
        `terbaca ${aug.metrics[key]}`,
      )
    }

    log(
      '6. Strip harian dan kartu menghitung hari yang sama',
      (aug.stripOutcomes.late ?? 0) === Number(aug.metrics.late)
      && (aug.stripOutcomes.present ?? 0) + (aug.stripOutcomes.late ?? 0) === Number(aug.metrics.present),
      JSON.stringify(aug.stripOutcomes),
    )

    // --- 6b. rentang kustom -------------------------------------------
    //
    // Kalendernya terbuka pada bulan rentang yang sedang berlaku
    // (Agustus 2026), jadi menekan tanggal 5 lalu 9 menghasilkan
    // rentang lima hari yang **tidak** sama dengan preset mana pun —
    // itu yang membuktikan jalur kustomnya benar-benar dipakai, bukan
    // cuma popovernya terbuka.
    cdp.events.length = 0

    /*
     * Ditekan lewat **teksnya**, bukan `data-testid`.
     *
     * Tombol Kustom adalah satu-satunya yang dibungkus
     * `<PopoverTrigger as-child>`, dan atribut yang menempel di
     * dalamnya tidak selalu selamat sampai DOM. Pemeriksaan di bawah
     * mencatat kenyataannya alih-alih mengandaikannya.
     */
    const customTestid = await evaluate(cdp, 'Boolean(document.querySelector("[data-testid=preset-custom]"))')

    log('6b. Tombol Kustom ada', await evaluate(cdp, `
      (() => {
        const b = [...document.querySelectorAll("button")]
          .find(el => /^(Kustom|Custom)$/.test(el.textContent.trim()))

        if (!b) return false

        b.click()

        return true
      })()
    `), customTestid ? 'data-testid ikut terpasang' : 'data-testid TIDAK ikut (as-child)')

    await sleep(900)

    const calendarOpen = await waitFor(
      cdp,
      'document.querySelector("[data-slot=range-calendar-trigger]")',
      10000,
    )

    log('6b. Pemilih tanggal kustom terbuka', calendarOpen)

    /*
     * Dua ketukan **terpisah**, dengan jeda, dan selnya dicari ulang
     * setiap kali.
     *
     * Mengklik keduanya dalam satu `evaluate` gagal: kalender merender
     * ulang sesudah ketukan pertama, jadi acuan DOM yang dipegang untuk
     * ketukan kedua sudah lepas dari pohonnya. Yang terjadi bukan galat
     * — rentangnya cuma punya ujung awal tanpa ujung akhir, dan tombol
     * Terapkan diam saja karena memang tidak ada rentang lengkap.
     */
    const tap = day => mouseClick(cdp, `
      [...document.querySelectorAll("[data-slot=range-calendar-trigger]")]
        .filter(el => !el.hasAttribute("data-outside-view"))
        .find(el => el.textContent.trim() === ${JSON.stringify(String(day))})
    `)

    const tappedFrom = await tap(5)
    await sleep(600)
    const tappedTo = await tap(9)

    const picked = {
      ok: tappedFrom === true && tappedTo === true,
      count: await evaluate(cdp, 'document.querySelectorAll("[data-slot=range-calendar-trigger]:not([data-outside-view])").length'),
    }

    log('6b. Dua tanggal terpilih di kalender', picked.ok === true, `${picked.count} sel`)

    await sleep(900)

    const draftState = await evaluate(cdp, `
      (() => ({
        apply: Boolean(document.querySelector("[data-testid=range-apply]")),
        selected: document.querySelectorAll("[data-slot=range-calendar-trigger][data-selected]").length,
        start: document.querySelectorAll("[data-slot=range-calendar-trigger][data-selection-start]").length,
        end: document.querySelectorAll("[data-slot=range-calendar-trigger][data-selection-end]").length,
      }))()
    `)

    log(
      '6b. Rentang tersorot di kalender',
      draftState.start === 1 && draftState.end === 1,
      JSON.stringify(draftState),
    )

    await clickAndWait(cdp, '[data-testid=range-apply]')

    const custom = await evaluate(cdp, READ)

    log('6b. Rentang kustom 5 hari terpakai', custom.stripCount === 5, `${custom.stripCount} petak`)
    log(
      '6b. Tanggal pilihan dikirim ke backend',
      requested(cdp, '/api/me/attendance')
        .some(u => u.includes('date_from=2026-08-05') && u.includes('date_to=2026-08-09')),
      requested(cdp, '/api/me/attendance').slice(-1)[0] ?? '',
    )

    // Kembali ke Agustus penuh untuk langkah berikutnya.
    await clickAndWait(cdp, '[data-testid=preset-lastMonth]')
    await waitFor(cdp, 'document.querySelectorAll("[data-testid=history-table] tbody tr").length > 0')

    // --- 7. panah periode ---------------------------------------------
    cdp.events.length = 0
    await clickAndWait(cdp, '[aria-label="Periode sebelumnya"]')

    const july = await evaluate(cdp, READ)

    log('7. Panah mundur mengubah periode', july.periodLabel !== aug.periodLabel, `${aug.periodLabel} → ${july.periodLabel}`)
    log('7. Lebar periode tidak berubah saat digeser', july.stripCount === aug.stripCount, `${july.stripCount} petak`)

    await clickAndWait(cdp, '[aria-label="Periode berikutnya"]')
    await waitFor(cdp, 'document.querySelectorAll("[data-testid=history-table] tbody tr").length > 0')

    const backToAug = await evaluate(cdp, READ)

    log('7. Panah maju kembali ke periode semula', backToAug.periodLabel === aug.periodLabel, backToAug.periodLabel ?? '')

    // --- 8. paginasi server-side --------------------------------------
    const firstPage = backToAug.dates

    log('8. Halaman pertama 10 baris', backToAug.rowCount === 10, `${backToAug.rowCount} baris`)
    log('8. Tombol "Sebelumnya" mati di halaman 1', backToAug.prevDisabled === true)

    cdp.events.length = 0
    await click(cdp, '[data-testid=page-next]')
    await waitFor(cdp, `
      (() => {
        const first = document.querySelector("[data-testid=history-table] tbody tr td")
        return first && first.innerText.trim() !== ${JSON.stringify(firstPage[0] ?? '')}
      })()
    `)

    const second = await evaluate(cdp, READ)

    shots.push(await shot(cdp, 'attendance-page2-id'))

    log(
      '8. Halaman berikutnya diminta ke server',
      requested(cdp, '/api/me/attendance').some(u => u.includes('page=2')),
      requested(cdp, '/api/me/attendance').join(' '),
    )
    log('8. Halaman kedua 9 baris sisanya', second.rowCount === 9, `${second.rowCount} baris`)
    log(
      '8. Baris halaman 2 tidak bertumpang tindih dengan halaman 1',
      second.dates.every(d => !firstPage.includes(d)),
      `${firstPage[0]} … | ${second.dates[0]} …`,
    )
    log('8. Tombol "Berikutnya" mati di halaman terakhir', second.nextDisabled === true)
    log('8. Tombol "Sebelumnya" hidup di halaman 2', second.prevDisabled === false)

    await click(cdp, '[data-testid=page-prev]')
    await waitFor(cdp, 'document.querySelectorAll("[data-testid=history-table] tbody tr").length === 10')

    // --- 9. urutan terbaru dahulu -------------------------------------
    const ordered = await evaluate(cdp, READ)

    const days = ordered.dates
      .map(text => Number((text.match(/(\d{1,2})/) || [])[1]))
      .filter(n => !Number.isNaN(n))

    log(
      '9. Terbaru dahulu',
      days.length === 10 && days.every((n, i) => i === 0 || days[i - 1] >= n),
      ordered.dates.slice(0, 3).join(' | '),
    )
    log('9. Baris teratas hari terakhir yang tercatat', /28/.test(ordered.dates[0] ?? ''), ordered.dates[0] ?? '')

    // --- 10. hanya data Bimo ------------------------------------------
    const foreign = ordered.text.match(/\b(HO0(?!03)\d\d|SGA\d{3}|LOK\d{3}|UAT\w+)\b/g)

    log(
      '10. Tidak ada identitas pegawai lain di layar',
      !foreign,
      foreign ? foreign.join(' ') : '',
    )

    // --- 11. bahasa Inggris -------------------------------------------
    await login()
    await setLocale(cdp, 'en')
    await goto(cdp, `${BASE}/me/attendance`, 4000)
    await waitFor(cdp, LOADED)
    await clickAndWait(cdp, '[data-testid=preset-lastMonth]')

    const english = await evaluate(cdp, READ)

    shots.push(await shot(cdp, 'attendance-desktop-en'))

    /*
     * Dibandingkan dalam huruf besar semua.
     *
     * Judul kartu dan judul seksi dirender `uppercase` lewat CSS, dan
     * `innerText` memulangkan teks yang **sudah** ditransformasi —
     * bukan yang tertulis di katalog. Perbandingan peka huruf di sini
     * menghasilkan FAIL untuk label yang sebenarnya tampil sempurna di
     * layar, dan itu kegagalan palsu yang paling mahal: ia menuntut
     * perbaikan pada kode yang tidak rusak.
     */
    const englishText = english.text.toUpperCase()

    for (const label of [
      'My Attendance',
      'Work Days',
      'Present',
      'Late',
      'Absent',
      'Working Hours',
      'Overtime',
      'Attendance History',
      'This Month',
      'Last Month',
      'Custom',
    ])
      log(`11. "${label}" tampil (EN)`, englishText.includes(label.toUpperCase()))

    log('11. Tanpa sisa kalimat Indonesia', !/Kehadiran Saya|Hari Kerja|Riwayat/.test(english.text))
    log('11. Tanpa kunci mentah i18n', !/me\.attendance\./.test(english.text))

    // --- 12. mode gelap ------------------------------------------------
    await setTheme(cdp, 'dark')
    await goto(cdp, `${BASE}/me/attendance`, 4000)
    await waitFor(cdp, LOADED)

    const dark = await evaluate(cdp, `
      (() => {
        const bg = getComputedStyle(document.body).backgroundColor
        return { dark: document.documentElement.classList.contains('dark'), bg }
      })()
    `)

    shots.push(await shot(cdp, 'attendance-dark-en'))

    log('12. Mode gelap aktif', dark.dark, dark.bg)

    await setTheme(cdp, 'light')

    // --- 13. ponsel 390 px --------------------------------------------
    await login()
    await setLocale(cdp, 'id')
    await viewport(cdp, 390, 844, true)
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me/attendance`, 4000)
    await waitFor(cdp, LOADED)
    await waitFor(cdp, 'document.querySelector("[data-testid=preset-lastMonth]")')
    await clickAndWait(cdp, '[data-testid=preset-lastMonth]')

    // Baris riwayatnya yang dinilai di bawah, jadi ia yang ditunggu —
    // bukan sekadar label periodenya yang sudah berganti lebih dulu.
    await waitFor(cdp, 'document.querySelectorAll("[data-testid=history-cards] > li").length > 0')

    const mobile = await evaluate(cdp, READ)

    shots.push(await shot(cdp, 'attendance-mobile-id'))

    log('13. Tanpa gulir mendatar di 390px', !mobile.horizontalOverflow, `${mobile.scrollWidth} > ${mobile.innerWidth}`)
    log('13. Tabel diganti kartu di ponsel', mobile.cardsVisible && !mobile.tableVisible)
    log('13. Pemilih periode tetap terpakai', mobile.text.includes('30 Hari'))
    log('13. Tanpa error konsol di ponsel', consoleErrors(cdp).length === 0, consoleErrors(cdp).slice(0, 2).join(' | '))

    console.log('\nBerkas bukti:')
    for (const f of shots)
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
