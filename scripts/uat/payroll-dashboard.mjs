/*
 * UAT browser Payroll Dashboard — Chrome headless lewat CDP.
 *
 * Tanpa Playwright: yang dipakai paket `ws` yang memang sudah ada di
 * repo ini, dan Chrome yang memang sudah terpasang di mesin.
 * Menambah Playwright berarti ~300MB browser terunduh di tiap mesin
 * dan CI hanya untuk memastikan satu halaman tidak pecah.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/payroll-dashboard.mjs
 *
 * Dua akun UAT dibuat lebih dulu di backend, dan dihapus lagi
 * sesudahnya:
 *
 *     python manage.py tenant_command payroll_dashboard_uat --schema=demo --password=<UAT_PAYROLL_PASS>
 *     python manage.py tenant_command payroll_dashboard_uat --schema=demo --remove
 *
 * Tanpa keduanya, pemeriksaan cakupan data dilewati dan dilaporkan
 * gagal — bukan diam-diam dianggap lolos.
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_USER, UAT_PASS, UAT_OUT,
 * UAT_PAYROLL_PASS (password akun uat-partial/uat-blind; bawaan UAT_PASS).
 * Keluar dengan kode 1 kalau ada pemeriksaan yang gagal, jadi ia bisa
 * dipasang di skrip lain apa adanya.
 */
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import WebSocket from 'ws'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9333
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
// Bawaannya di luar repo: skrip ini menulis profil Chrome dan
// tangkapan layar, dan keduanya tidak punya urusan dengan berkas
// sumber. `UAT_OUT` menimpanya kalau hasilnya memang mau disimpan.
const OUT = process.env.UAT_OUT
  ?? path.join(os.tmpdir(), 'meinova-uat-payroll-dashboard')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}
// Password akun yang dibentuk `payroll_dashboard_uat` — sama dengan yang
// dioper ke perintah itu (`--password` atau DEMO_PASSWORD).
const UAT_ACCOUNT_PASS = process.env.UAT_PAYROLL_PASS ?? PASS

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function launch() {
  const profile = path.join(OUT, 'chrome-profile')

  /*
   * Chrome sisa run sebelumnya ditutup dulu, dan itu bukan
   * kebersihan belaka.
   *
   * `chrome.kill()` di `finally` cuma membunuh proses peluncurnya;
   * Chrome-nya sendiri bisa selamat dan tetap memegang port debug.
   * Run berikutnya lalu **menempel ke browser yang lama** — port yang
   * sama menjawab — lengkap dengan cookie dan localStorage sesi
   * sebelumnya, sementara Chrome yang baru diluncurkan gagal
   * mengikat port dan menganggur. Gejalanya halus: seluruh
   * pemeriksaan tetap jalan dan tetap lolos, tapi sidebar menyebut
   * akun UAT yang dipakai di akhir run sebelumnya, dan tangkapan
   * layarnya jadi berbohong tentang siapa yang sedang melihat.
   */
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
    '--window-size=1440,1000',
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
    else if (msg.method) {
      events.push(msg)
    }
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

async function goto(cdp, url, waitMs = 4000) {
  await cdp.send('Page.navigate', { url })
  await sleep(waitMs)
}

async function viewport(cdp, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  })
}
/*
 * Filter dashboard adalah `MLookupSelect`: sebuah tombol bertuliskan
 * "Label: nilai", dan begitu dibuka, daftar tombol pilihan. Diklik
 * lewat DOM apa adanya — handler-nya `@click` Vue biasa, jadi
 * `element.click()` menempuh jalur yang sama persis dengan jari.
 */
function OPEN_FILTER(label) {
  return `
  (() => {
    const want = ${JSON.stringify(label)} + ":"
    const btn = [...document.querySelectorAll("button")]
      .find(b => b.innerText.trim().startsWith(want))
    if (!btn) return "tombol filter tidak ada"
    btn.click()
    return "ok"
  })()
`
}

function PICK_OPTION(text) {
  return `
  (() => {
    const want = ${JSON.stringify(text)}
    const opts = [...document.querySelectorAll("div.absolute button")]
    const hit = opts.find(b => b.innerText.trim().includes(want))
    if (!hit)
      return "pilihan tidak ada: " + opts.map(o => o.innerText.trim()).join(" / ")
    hit.click()
    return "ok"
  })()
`
}

/*
 * Satu bacaan halaman untuk seluruh pemeriksaan isi. Membacanya
 * sepotong-sepotong berarti tiap `log()` melihat keadaan halaman pada
 * saat yang sedikit berbeda — dan yang gagal jadi tidak bisa dipercaya
 * menyebut sebabnya.
 */
const READ_PAGE = `
  (() => {
    const text = document.body.innerText
    const cells = row => [...row.querySelectorAll("td")].map(td => td.innerText.trim())
    return {
      text,
      // Kartu KPI: label dan angkanya dua <p> bersebelahan di
      // MDashboardStat. Dibaca lewat hubungan itu, bukan lewat urutan
      // kartu — dashboard ini punya kartu lain yang juga memuat angka
      // bertabular-nums.
      kpi: [...document.querySelectorAll("[data-slot=card] p.tabular-nums.truncate")]
        .map(value => ({
          label: value.previousElementSibling?.innerText.trim() ?? "",
          value: value.innerText.trim(),
        }))
        .filter(card => card.label),
      filterButtons: [...document.querySelectorAll("button")]
        .map(b => b.innerText.trim())
        .filter(t => /^(Company|Payroll Period|Payroll Run):/.test(t)),
      headers: [...document.querySelectorAll("th")].map(n => n.innerText.trim()),
      rows: [...document.querySelectorAll("tbody tr")].map(cells),
      links: [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")),
      // Kartu "Perlu Ditindaklanjuti": dihitung dari elemen barisnya,
      // bukan dari teks halaman — kartunya bertetangga dengan kartu
      // lain yang juga punya kalimat "tidak ada".
      attention: (() => {
        const card = [...document.querySelectorAll("[data-slot=card]")]
          .find(c => c.innerText.startsWith("Perlu Ditindaklanjuti"))
        if (!card) return { count: 0, linked: 0, href: null, first: "kartu tidak ada" }
        // Baris daftar saja (ul > li, atau ul > a untuk baris yang
        // memang bertujuan). Tautan "Lihat Semua" di kepala kartu
        // bukan temuan, dan menghitungnya membuat kartu kosong
        // terbaca berisi satu.
        const rows = [...card.querySelectorAll("ul > li, ul > a")]
          .filter(node => node.innerText.trim())
        return {
          count: rows.length,
          linked: rows.filter(n => n.matches("a[href]")).length,
          href: rows[0]?.getAttribute?.("href") ?? null,
          first: (rows[0]?.innerText ?? "").replace(/\\n+/g, " · ").slice(0, 120),
        }
      })(),
      emptyText: (() => {
        const hit = document.body.innerText.match(/Belum ada[^\\n]*|Tidak ada[^\\n]*/)
        return hit ? hit[0] : ""
      })(),
      svg: document.querySelectorAll("svg path, svg rect, svg circle").length,
      hasNaN: /NaN|undefined|\\[object Object\\]/.test(text),
    }
  })()
`

const report = []

function log(label, ok, detail = '') {
  report.push({ label, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
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
    await viewport(cdp, 1440, 1000)

    // --- login ------------------------------------------------------
    //
    // Token diambil langsung dari API lalu ditanam sebagai cookie,
    // bukan diketikkan ke formnya.
    //
    // Bukan jalan pintas yang menghindari pengujian: yang diuji layar
    // ini bukan halaman login. Mengisi form lewat CDP berarti menebak
    // bagaimana `v-model` sebuah komponen pihak ketiga mendengarkan
    // event — dan tebakan yang meleset menghasilkan UAT yang gagal
    // pada halaman yang bahkan bukan sasarannya. Cookie `access`
    // adalah satu-satunya sumber kebenaran sesi di aplikasi ini
    // (`isAuthed: !!state.access`), jadi menanamnya menempatkan
    // browser pada keadaan yang sama persis dengan sesudah login.
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

    const afterLogin = await evaluate(cdp, 'location.pathname')
    log('Sesi aktif', !afterLogin.includes('login'), `pathname=${afterLogin}`)

    // --- dashboard --------------------------------------------------
    const errors = []
    cdp.events.length = 0

    await goto(cdp, `${BASE}/payroll/dashboard`, 9000)

    for (const e of cdp.events) {
      if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
        errors.push(e.params.entry.text)
      if (e.method === 'Runtime.exceptionThrown')
        errors.push(e.params.exceptionDetails.text)
    }

    const page = await evaluate(cdp, `
      (() => {
        const text = document.body.innerText
        const cards = [...document.querySelectorAll("[data-slot=card]")].length
        const heading = document.querySelector("h1")?.innerText ?? ""
        return {
          heading,
          headings: [...document.querySelectorAll("h1")].map(n => n.innerText.trim()),
          statValues: [...document.querySelectorAll("[data-slot=card] p.tabular-nums")]
            .map(n => ({ text: n.innerText.trim(), clipped: n.scrollWidth > n.clientWidth + 1 })),
          cards,
          hasNaN: /NaN|undefined|\\[object Object\\]/.test(text),
          horizontalOverflow:
            document.documentElement.scrollWidth > window.innerWidth + 2,
          labels: [...document.querySelectorAll("h1, h3, p, [data-slot=card-title], [data-slot=card-description], th")]
            .map(n => n.innerText.trim()).filter(Boolean),
          snippet: text.slice(0, 2500),
        }
      })()
    `)

    log('Judul halaman Payroll Dashboard', page.headings.some(h => h.includes('Payroll Dashboard')), page.headings.join(' / '))

    const clipped = page.statValues.filter(v => v.clipped)
    log('Angka KPI tidak terpotong', clipped.length === 0, clipped.map(v => v.text).join(' | ') || page.statValues.map(v => v.text).join(' | '))
    log('Tidak ada NaN / undefined / [object Object]', !page.hasNaN)
    log('Tidak ada console error', errors.length === 0, errors.slice(0, 3).join(' | '))
    log('Halaman tidak menggulir mendatar (desktop)', !page.horizontalOverflow)

    const want = [
      'Pegawai',
      'Gross Payroll',
      'Total Potongan',
      'Net Payroll',
      'Lembur',
      'Alpa / Cuti Tak Dibayar',
      'Progress Payroll Run',
      'Perlu Ditindaklanjuti',
      'Payroll Run Berjalan',
      'Tren Biaya Payroll',
      'Komposisi Payroll',
      'Per Kebijakan',
      'Per Departemen',
      'Per Lokasi',
    ]
    const missing = want.filter(w => !page.labels.some(l => l.includes(w)))
    log('Seluruh widget terender', missing.length === 0, missing.length ? `hilang: ${missing.join(', ')}` : `${want.length} widget`)

    // --- rute -------------------------------------------------------
    //
    // `/payroll` bukan lagi halamannya, cuma pengoper. Diperiksa
    // karena tautan lama dan pengetikan langsung tetap ada, dan
    // pengoper yang putus berakhir di 404 tanpa ada yang melaporkannya.
    await goto(cdp, `${BASE}/payroll`, 5000)

    const redirected = await evaluate(cdp, 'location.pathname')

    log('`/payroll` mengoper ke `/payroll/dashboard`', redirected === '/payroll/dashboard', `pathname=${redirected}`)

    await goto(cdp, `${BASE}/payroll/dashboard`, 6000)

    // --- filter -----------------------------------------------------
    const shown = await evaluate(cdp, READ_PAGE)

    log('Tiga filter tersedia', shown.filterButtons.length === 3, shown.filterButtons.join(' | '))

    async function pick(filter, option) {
      const opened = await evaluate(cdp, OPEN_FILTER(filter))
      if (opened !== 'ok')
        return opened

      await sleep(1200)

      const picked = await evaluate(cdp, PICK_OPTION(option))

      // Dropdown pilih-satu menutup sendiri; yang bercentang tidak.
      await evaluate(cdp, `document.body.click(), true`)
      await sleep(3500)

      return picked
    }

    log('Filter Company bekerja', (await pick('Company', 'Meinova Mineral Resources')) === 'ok')

    log('Filter Payroll Period bekerja', (await pick('Payroll Period', 'UAT-2027-05')) === 'ok')

    log('Filter Payroll Run bekerja', (await pick('Payroll Run', 'PAY-2027-00003')) === 'ok')

    const run8 = await evaluate(cdp, READ_PAGE)

    const kpi = Object.fromEntries(run8.kpi.map(c => [c.label, c.value]))

    log('KPI mengikuti pilihan', kpi.Pegawai === '15', `Pegawai=${kpi.Pegawai} Gross=${kpi['Gross Payroll']} Net=${kpi['Net Payroll']}`)

    log('Enam KPI terisi', ['Pegawai', 'Gross Payroll', 'Total Potongan', 'Net Payroll', 'Lembur', 'Alpa / Cuti Tak Dibayar'].every(k => (kpi[k] ?? '') !== ''), Object.entries(kpi).map(([k, v]) => `${k}=${v}`).join(' | '))

    // --- tabel run berjalan -----------------------------------------
    const WANT_COLUMNS = [
      'Pegawai',
      'NIK',
      'Kebijakan',
      'Dasar',
      'Dasar Upah',
      'Tunjangan & Input',
      'Lembur',
      'Potongan',
      'Net Pay',
      'Status',
    ]

    // Judul kolom di-uppercase lewat CSS, dan `innerText` ikut
    // ter-transform — dibandingkan tanpa memandang besar-kecil huruf,
    // kalau tidak seluruhnya terbaca "hilang".
    const same = (a, b) => a.toLocaleLowerCase() === b.toLocaleLowerCase()

    const missingColumns = WANT_COLUMNS.filter(
      c => !run8.headers.some(h => same(h, c)),
    )

    log('Kolom Payroll Run Berjalan lengkap', missingColumns.length === 0, missingColumns.length
      ? `hilang: ${missingColumns.join(', ')}`
      : run8.headers.join(' | '))

    const basisColumn = run8.headers.findIndex(h => same(h, 'Dasar'))
    const policyColumn = run8.headers.findIndex(h => same(h, 'Kebijakan'))

    const bases = new Set(run8.rows.map(r => r[basisColumn]).filter(Boolean))
    const policies = new Set(run8.rows.map(r => r[policyColumn]).filter(Boolean))

    log('DAILY + MONTHLY dalam satu run', bases.has('Harian') && bases.has('Bulanan'), [...bases].join(' / '))

    // Enum mentah terbaca sebagai HURUF BESAR tanpa spasi. Kolomnya
    // boleh berisi nama kebijakan atau "Default Perusahaan" — yang
    // tidak boleh cuma `MONTHLY`/`DAILY`/kode mentah.
    const rawPolicy = [...policies].filter(p => /^[A-Z0-9_\-]+$/.test(p))

    log('Kebijakan tampil human-readable', rawPolicy.length === 0, [...policies].join(' / '))

    // --- attention --------------------------------------------------
    log('Perlu Ditindaklanjuti terisi', run8.attention.count > 0, `${run8.attention.count} temuan: ${run8.attention.first}`)

    // Temuan tanpa tujuan adalah temuan yang tidak bisa
    // ditindaklanjuti — itu seluruh gunanya kartu ini. Diperiksa
    // sebagai <a href> sungguhan, bukan sekadar "ada barisnya":
    // `:is="'NuxtLink'"` berbentuk string menghasilkan elemen
    // <nuxtlink> yang tampak bisa ditekan dan tidak melakukan apa pun.
    log('Temuan menunjuk layar yang bisa dibuka', run8.attention.count > 0
    && run8.attention.linked === run8.attention.count, `${run8.attention.linked} dari ${run8.attention.count} bertaut → `
    + `${run8.attention.href ?? '-'}`)

    if (run8.attention.href) {
      await goto(cdp, `${BASE}${run8.attention.href}`, 8000)

      const target = await evaluate(cdp, `
        (() => ({
          path: location.pathname,
          text: document.body.innerText.slice(0, 300),
        }))()
      `)

      log('Tautan temuan tidak berakhir di 404', target.path === run8.attention.href
      && !/404|tidak ditemukan|Page not found/i.test(target.text), target.path)

      await goto(cdp, `${BASE}/payroll/dashboard`, 7000)
    }

    // --- chart ------------------------------------------------------
    log('Chart terender', run8.svg > 20, `${run8.svg} elemen svg`)

    log('Breakdown terender', ['Per Kebijakan', 'Per Departemen', 'Per Lokasi']
      .every(l => run8.text.includes(l)))

    // --- navigasi ke run --------------------------------------------
    //
    // Tautan yang menunjuk halaman yang tidak ada adalah kegagalan
    // yang cuma terlihat kalau benar-benar dibuka.
    const runLink = run8.links.find(h => /^\/payroll\/payroll-runs\/\d+/.test(h))

    log('Payroll Run Berjalan punya tautan', Boolean(runLink), runLink ?? '')

    if (runLink) {
      await goto(cdp, `${BASE}${runLink}`, 8000)

      const opened = await evaluate(cdp, `
        (() => ({
          path: location.pathname,
          text: document.body.innerText.slice(0, 400),
        }))()
      `)

      log('Payroll Run dapat dibuka', opened.path.startsWith('/payroll/payroll-runs')
      && !/404|tidak ditemukan|Page not found/i.test(opened.text), `${opened.path} — ${opened.text.replace(/\n+/g, ' · ').slice(0, 120)}`)

      await goto(cdp, `${BASE}/payroll/dashboard`, 7000)
    }

    console.log(`\n--- cuplikan isi halaman ---\n${page.snippet}\n`)

    log('Screenshot desktop', true, await shot(cdp, 'payroll-dashboard-desktop'))

    // Layout aplikasi menggulir di dalam wadahnya sendiri, jadi
    // `captureBeyondViewport` cuma memotret layar pertama. Sisanya
    // dipotret dengan menggulir wadah itu.
    const SCROLLER = `
      (() => {
        const all = [...document.querySelectorAll("*")]
        const box = all.find(el => el.scrollHeight > el.clientHeight + 200
          && /auto|scroll/.test(getComputedStyle(el).overflowY))
        return box ? box.scrollHeight : document.body.scrollHeight
      })()
    `

    const height = await evaluate(cdp, SCROLLER)

    for (const [index, ratio] of [0.33, 0.62, 0.99].entries()) {
      await evaluate(cdp, `
        (() => {
          const all = [...document.querySelectorAll("*")]
          const box = all.find(el => el.scrollHeight > el.clientHeight + 200
            && /auto|scroll/.test(getComputedStyle(el).overflowY))
          const target = ${ratio} * ((box ?? document.scrollingElement).scrollHeight)
          ;(box ?? window).scrollTo({ top: target, behavior: "instant" })
          return true
        })()
      `)

      await sleep(1800)

      log(`Screenshot desktop gulir ${index + 1}`, true, await shot(cdp, `payroll-dashboard-desktop-${index + 2}`))
    }

    console.log(`tinggi halaman: ${height}px`)

    // --- mode terang -------------------------------------------------
    //
    // Preferensinya "system" (`nuxt.config.colorMode`), jadi yang
    // menentukan `prefers-color-scheme` browsernya. Diperiksa karena
    // widget ini memakai kelas berpasangan (`text-emerald-600
    // dark:text-emerald-400`) — kelas yang lupa pasangannya baru
    // terlihat di satu mode saja.
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'light' }],
    })

    await goto(cdp, `${BASE}/payroll/dashboard`, 8000)

    const light = await evaluate(cdp, `
      (() => {
        const body = getComputedStyle(document.body)
        return {
          background: body.backgroundColor,
          color: body.color,
          dark: document.documentElement.classList.contains("dark"),
          hasNaN: /NaN|undefined/.test(document.body.innerText),
        }
      })()
    `)

    log('Mode terang tetap terbaca', !light.dark && !light.hasNaN, `bg=${light.background} teks=${light.color}`)
    log('Screenshot mode terang', true, await shot(cdp, 'payroll-dashboard-light'))

    await cdp.send('Emulation.setEmulatedMedia', { features: [] })

    // --- narrow viewport --------------------------------------------
    await viewport(cdp, 390, 844)
    await sleep(2500)

    const narrow = await evaluate(cdp, `
      (() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        scrollWidth: document.documentElement.scrollWidth,
        inner: window.innerWidth,
      }))()
    `)

    log('Tidak ada overflow mendatar (390px)', !narrow.overflow, `scrollWidth=${narrow.scrollWidth} viewport=${narrow.inner}`)
    log('Screenshot narrow', true, await shot(cdp, 'payroll-dashboard-narrow'))

    // --- cakupan data, empty state, snapshot ------------------------
    //
    // Bagian ini memakai akun UAT sementara (`uat_fixture.py setup`).
    // Angka yang diperiksa **tidak ditulis di sini**: yang dibandingkan
    // selalu dua bacaan dari aplikasi yang sama, karena UAT yang
    // menghafal angka akan gagal tiap kali data peragaan disegarkan
    // dan gagalnya tidak menyebut sebab yang benar.
    await viewport(cdp, 1440, 1000)

    async function token(username, password) {
      const res = await (await fetch(`${API}/api/accounts/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })).json()

      return res.access ?? null
    }

    async function dash(access, query = '') {
      const res = await (await fetch(
        `${API}/api/payroll/dashboard/${query}`,
        { headers: { Authorization: `Bearer ${access}` } },
      )).json()

      return res?.data?.widgets ?? {}
    }

    const partialToken = await token('uat-partial', UAT_ACCOUNT_PASS)
    const blindToken = await token('uat-blind', UAT_ACCOUNT_PASS)

    log('Akun UAT tersedia', Boolean(partialToken && blindToken), partialToken && blindToken ? '' : 'jalankan: python manage.py tenant_command payroll_dashboard_uat --schema=demo')

    if (partialToken && blindToken) {
      const RUN_WIDE = '?payroll_run=1'

      const adminWide = await dash(auth.access, RUN_WIDE)
      const partialWide = await dash(partialToken, RUN_WIDE)

      const adminCount = adminWide.employees?.value ?? 0
      const partialCount = partialWide.employees?.value ?? 0

      log('Cakupan sebagian hanya melihat pegawainya', partialCount > 0 && partialCount < adminCount, `admin=${adminCount} pegawai · partial=${partialCount} pegawai`)

      // Kartu KPI dan tabel di bawahnya menjumlahkan queryset yang
      // sama; kalau tidak, selisihnya cuma terbaca sebagai salah hitung.
      const partialRows = partialWide.run_employees?.meta?.count
        ?? partialWide.run_employees?.items?.length ?? 0

      log('KPI cocok dengan isi tabel', partialCount === partialRows, `KPI=${partialCount} baris=${partialRows}`)

      // Run di luar cakupan **tidak** boleh diam-diam diganti run
      // lain. Diperiksa berpasangan, karena kosong saja tidak
      // membuktikan apa-apa: yang membuktikannya adalah filter yang
      // sama tanpa `payroll_run` justru berisi — jadi kalau
      // `selection()` mundur ke run bawaan, angkanya akan muncul di
      // sini.
      const withDefault = await dash(auth.access, '?company=2')
      const outOfScope = await dash(auth.access, '?company=2&payroll_run=999')
      const wrongCompany = await dash(auth.access, '?company=1&payroll_run=8')

      log('Run di luar cakupan menghasilkan kosong, bukan run lain', (withDefault.employees?.value ?? 0) > 0
      && (outOfScope.employees?.value ?? -1) === 0
      && (outOfScope.run_employees?.items?.length ?? -1) === 0
      && (wrongCompany.employees?.value ?? -1) === 0, `company=2 → ${withDefault.employees?.value} pegawai · `
      + `+run tak dikenal → ${outOfScope.employees?.value} · `
      + `run milik company lain → ${wrongCompany.employees?.value}`)

      const blind = await dash(blindToken, RUN_WIDE)

      log('Tanpa izin baca payroll: nol, bukan total run', (blind.employees?.value ?? -1) === 0
      && Number(blind.gross_payroll?.value ?? -1) === 0
      && Number(blind.net_payroll?.value ?? -1) === 0, `pegawai=${blind.employees?.value} gross=${blind.gross_payroll?.value}`)

      // --- snapshot run finalized -----------------------------------
      const runDoc = await (await fetch(
        `${API}/api/payroll/payroll-runs/2/`,
        { headers: { Authorization: `Bearer ${auth.access}` } },
      )).json()

      const frozen = runDoc?.data ?? runDoc
      const finalized = await dash(auth.access, '?payroll_run=2')
      const again = await dash(auth.access, '?payroll_run=2')

      const net = Number(finalized.net_payroll?.value ?? Number.NaN)

      log('Run finalized memakai snapshot', Math.abs(net - Number(frozen.total_net)) < 1
      && net === Number(again.net_payroll?.value), `dashboard=${net} · run.total_net=${frozen.total_net} · status=${frozen.status}`)

      // --- empty state di layar -------------------------------------
      for (const [name, access] of [['blind', blindToken], ['partial', partialToken]]) {
        // Profil pengguna dicache di penyimpanan browser; tanpa
        // membersihkannya, sidebar tetap menyebut nama akun
        // sebelumnya walau seluruh permintaan API sudah memakai token
        // yang baru — dan tangkapan layarnya jadi menyesatkan.
        await evaluate(cdp, `(() => { localStorage.clear(); sessionStorage.clear(); return true })()`)

        await cdp.send('Network.setCookie', {
          name: 'access',
          value: access,
          url: BASE,
          path: '/',
          sameSite: 'Lax',
        })

        await cdp.send('Network.deleteCookies', { name: 'refresh', url: BASE })

        await goto(cdp, `${BASE}/payroll/dashboard`, 9000)

        const view = await evaluate(cdp, READ_PAGE)
        const seen = Object.fromEntries(view.kpi.map(c => [c.label, c.value]))

        if (name === 'blind') {
          // Rupiah diformat dengan spasi tak-putus (U+00A0), jadi
          // "Rp 0" di layar bukan "Rp 0" yang diketik di sini.
          const flat = value => (value ?? '').replace(/\s+/g, ' ').trim()

          const zeroed = ['Pegawai', 'Gross Payroll', 'Net Payroll']
            .every(k => /^(?:0|Rp 0)$/.test(flat(seen[k])))

          const kpiText = view.kpi
            .map(c => `${c.label}=${flat(c.value)}`)
            .join(' | ')

          log(
            'Empty state bersih (tanpa izin baca payroll)',
            !view.hasNaN && zeroed && Boolean(view.emptyText),
            `${kpiText} · baris=${view.rows.length}`
            + ` · pesan="${view.emptyText}" · NaN/undefined=${view.hasNaN}`,
          )
        }
        else {
          const api = await dash(access)

          log('Layar cakupan sebagian sama dengan API-nya', seen.Pegawai === String(api.employees?.value ?? ''), `layar=${seen.Pegawai} api=${api.employees?.value}`)
        }

        log(`Screenshot ${name}`, true, await shot(cdp, `payroll-dashboard-${name}`))
      }

      // Dikembalikan ke admin supaya run berikutnya — dan siapa pun
      // yang membuka browser ini sesudahnya — tidak mewarisi sesi UAT.
      await evaluate(cdp, `(() => { localStorage.clear(); sessionStorage.clear(); return true })()`)

      await cdp.send('Network.setCookie', {
        name: 'access',
        value: auth.access,
        url: BASE,
        path: '/',
        sameSite: 'Lax',
      })

      // --- pilihan yang memang tidak punya data ----------------------
      //
      // Bukan akun yang dibatasi, melainkan pemegang akses penuh yang
      // memilih perusahaan yang belum pernah menjalankan payroll —
      // keadaan kosong yang paling sering benar-benar terjadi, dan
      // yang paling mudah menghasilkan NaN atau halaman putih.
      await goto(cdp, `${BASE}/payroll/dashboard`, 9000)

      const chosen = await pick('Company', 'Meinova Nusantara')

      const blank = await evaluate(cdp, READ_PAGE)
      const blankKpi = Object.fromEntries(
        blank.kpi.map(c => [c.label, c.value.replace(/\s+/g, ' ').trim()]),
      )

      log(
        'Company tanpa payroll: empty state bersih',
        chosen === 'ok'
        && !blank.hasNaN
        && blank.rows.length === 0
        && /^(?:0|Rp 0)$/.test(blankKpi.Pegawai ?? '')
        && Boolean(blank.emptyText),
        `Pegawai=${blankKpi.Pegawai} Gross=${blankKpi['Gross Payroll']}`
        + ` · baris=${blank.rows.length} · pesan="${blank.emptyText}"`,
      )

      log('Screenshot empty state', true, await shot(cdp, 'payroll-dashboard-empty'))
    }

    await viewport(cdp, 1440, 1000)
  }
  finally {
    // `Browser.close` menutup Chrome-nya sendiri, bukan cuma proses
    // peluncurnya — lihat catatan di `launch()`.
    try { await cdp.send('Browser.close') }
    catch {}

    cdp.close()
    chrome.kill()
  }

  const failed = report.filter(r => !r.ok)
  console.log(`\n=== ${report.length - failed.length}/${report.length} lolos ===`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})
