/*
 * UAT browser Application Launcher beranda — Chrome headless lewat CDP.
 *
 * Tanpa Playwright: yang dipakai paket `ws` yang memang sudah ada di
 * repo ini, dan Chrome yang memang sudah terpasang di mesin. Pola dan
 * alasannya sama persis dengan `payroll-dashboard.mjs` di sebelah.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/home-launcher.mjs
 *     UAT_USER=demo.opr1 node scripts/uat/home-launcher.mjs
 *
 * Akun kedua itu yang penting: ia hanya berhak atas HR + Workflow, dan
 * justru keadaan itulah yang diuji berkas ini — modul yang tidak boleh
 * ia buka **tetap tampil**, kelabu dan tidak bisa ditekan.
 *
 * Yang dikunci:
 *
 *   1. seluruh katalog aplikasi tampil, bukan cuma yang bisa dibuka;
 *   2. yang bisa dibuka adalah tautan sungguhan ke rute miliknya;
 *   3. yang tidak bisa dibuka bukan tautan, ber-`aria-disabled`, dan
 *      **tidak berpindah halaman saat diklik**;
 *   4. tooltip sebabnya ada, dan bunyinya datang dari katalog i18n —
 *      bukan kalimat yang ditulis di komponen;
 *   5. tata letak tidak meluber di empat lebar layar.
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
const PORT = Number(process.env.UAT_PORT ?? 9342)
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}
// Bawaannya di luar repo: skrip ini menulis profil Chrome dan tangkapan
// layar, dan keduanya tidak punya urusan dengan berkas sumber.
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), `meinova-uat-launcher-${USER}`)

const sleep = ms => new Promise(r => setTimeout(r, ms))

let failed = 0

function log(name, ok, detail = '') {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function launch() {
  const profile = path.join(OUT, 'chrome-profile')

  /*
   * Chrome sisa run sebelumnya ditutup dulu. `proc.kill()` cuma
   * membunuh proses peluncurnya; Chrome-nya sendiri bisa selamat dan
   * tetap memegang port debug, lalu run berikutnya menempel ke browser
   * lama lengkap dengan cookie sesi sebelumnya — seluruh pemeriksaan
   * tetap jalan dan tetap lolos, tapi atas nama akun yang salah.
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
  await fs.mkdir(OUT, { recursive: true })

  const proc = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    '--window-size=1440,1000',
    'about:blank',
  ], { stdio: 'ignore' })

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

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw.toString())

    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
    }
  })

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id
    pending.set(mid, { resolve, reject })
    ws.send(JSON.stringify({ id: mid, method, params }))
  })

  return { send, close: () => ws.close() }
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
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  const file = path.join(OUT, `${name}.png`)

  await fs.writeFile(file, Buffer.from(data, 'base64'))

  return file
}

const goto = async (cdp, url, wait = 6000) => {
  await cdp.send('Page.navigate', { url })
  await sleep(wait)
}

const viewport = (cdp, width, height) => cdp.send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: width < 700,
})

/*
 * Satu bacaan halaman untuk seluruh pemeriksaan isi. Membacanya
 * sepotong-sepotong berarti tiap `log()` melihat keadaan halaman pada
 * saat yang sedikit berbeda — dan yang gagal jadi tidak bisa dipercaya
 * menyebut sebabnya.
 *
 * Ubin dikenali dari **panel launcher**, bukan dari kelas CSS-nya:
 * kelas berubah tiap kali tampilannya disetel, dan pemeriksaan yang
 * menempel pada kelas gagal karena hal yang bukan perilaku.
 */
const READ = `
(() => {
  const panel = document.querySelector('[data-slot="application-launcher"]')
  const grid = panel && panel.querySelector('div.grid')
  const items = [...document.querySelectorAll('[data-slot="application-launcher-item"]')]

  return {
    hasPanel: !!panel,
    cols: grid
      ? getComputedStyle(grid).gridTemplateColumns.split(' ').filter(w => parseFloat(w) > 0).length
      : 0,
    items: items.map((node) => {
      const label = node.querySelector('span:last-of-type')

      return {
        code: node.getAttribute('data-app-code'),
        enabled: node.getAttribute('data-enabled') === 'true',
        label: (label ? label.innerText : node.innerText).trim().replace(/\\n+/g, ' '),
        href: node.getAttribute('href'),
        isLink: node.tagName === 'A',
        disabled: node.getAttribute('aria-disabled') === 'true',
        cursor: getComputedStyle(node).cursor,
        // Nama modul harus tetap terbaca: yang dipudarkan ubinnya,
        // bukan labelnya sampai hilang.
        labelOpacity: label ? Number(getComputedStyle(label).opacity) : 1,
      }
    }),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }
})()
`

async function main() {
  const chrome = await launch()
  const cdp = await attach()

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Network.enable')

  try {
    await viewport(cdp, 1440, 1000)

    /*
     * Token diambil langsung dari API lalu ditanam sebagai cookie,
     * bukan diketikkan ke formnya: yang diuji layar ini bukan halaman
     * login, dan cookie `access` adalah satu-satunya sumber kebenaran
     * sesi di aplikasi ini.
     */
    const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: USER, password: PASS }),
    })).json()

    if (!auth.access)
      throw new Error(`Login API gagal untuk ${USER}: ${JSON.stringify(auth)}`)

    // Katalog dari API jadi **acuan**, bukan daftar yang ditulis di
    // sini: begitu modul baru masuk `APP_CATALOG`, test ini ikut
    // menguji modul itu tanpa disentuh.
    const catalog = await (await fetch(`${API}/api/administration/dashboard/apps/`, {
      headers: { Authorization: `Bearer ${auth.access}` },
    })).json()

    const expected = catalog.filter(app =>
      app.is_accessible === false || app.is_available === false || app.is_favorite,
    )

    const shouldBeDisabled = expected.filter(app =>
      app.is_accessible === false || app.is_available === false,
    )

    const shouldBeEnabled = expected.filter(app =>
      app.is_accessible !== false && app.is_available !== false,
    )

    await goto(cdp, `${BASE}/`, 2500)

    for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]])
      await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })

    await goto(cdp, `${BASE}/`, 8000)

    const page = await evaluate(cdp, READ)

    log('Panel launcher ada', page.hasPanel)

    // --- 1. seluruh katalog tampil ----------------------------------
    log('Jumlah ubin = katalog yang seharusnya tampil',
      page.items.length === expected.length,
      `ubin=${page.items.length} katalog=${expected.length} (aktif=${shouldBeEnabled.length} kelabu=${shouldBeDisabled.length})`)

    log('Katalog memuat modul yang tidak bisa dibuka pengguna ini',
      shouldBeDisabled.length > 0 || USER === 'admin',
      `kelabu=${shouldBeDisabled.map(a => a.app_code).join(',') || '(tidak ada)'}`)

    // --- 2. yang bisa dibuka tetap tautan ----------------------------
    const links = page.items.filter(item => item.isLink)

    log('Aplikasi yang bisa dibuka adalah tautan',
      links.length === shouldBeEnabled.length,
      `tautan=${links.length} diharapkan=${shouldBeEnabled.length}`)

    log('Rute tiap aplikasi aktif benar',
      shouldBeEnabled.every(app => links.some(item => item.href === app.link)),
      links.map(item => item.href).join(' '))

    // --- 3. yang tidak bisa dibuka: kelabu, bukan tautan -------------
    const disabled = page.items.filter(item => item.disabled)

    log('Aplikasi tanpa akses dirender disabled',
      disabled.length === shouldBeDisabled.length,
      `disabled=${disabled.length} diharapkan=${shouldBeDisabled.length}`)

    log('Ubin disabled bukan tautan',
      disabled.every(item => !item.isLink && !item.href),
      disabled.map(item => `${item.label}:${item.isLink ? 'a' : 'div'}`).join(' '))

    log('Kursor menandai tidak bisa ditekan',
      disabled.every(item => item.cursor === 'not-allowed'),
      [...new Set(disabled.map(item => item.cursor))].join(' '))

    log('Nama aplikasi disabled tetap terbaca',
      disabled.every(item => item.label && item.labelOpacity >= 0.4),
      disabled.map(item => `${item.label}=${item.labelOpacity}`).join(' '))

    // --- 4. disabled tidak menavigasi -------------------------------
    if (disabled.length) {
      const before = await evaluate(cdp, 'location.pathname')

      await evaluate(cdp, `
        (() => {
          const node = document.querySelector('[data-slot="application-launcher-item"][data-enabled="false"]')
          node.click()
          return true
        })()
      `)

      await sleep(1500)

      const after = await evaluate(cdp, 'location.pathname')

      log('Klik ubin disabled tidak berpindah halaman',
        before === after,
        `${before} -> ${after}`)
    }

    // --- 5. tooltip sebabnya ----------------------------------------
    if (disabled.length) {
      /*
       * Dibuka lewat **fokus papan ketik**, bukan hover.
       *
       * Bukan jalan pintas: itu justru jalur yang paling mudah rusak
       * tanpa ketahuan — pengguna papan ketik tidak punya hover sama
       * sekali, jadi tooltip yang hanya muncul saat disentuh kursor
       * berarti sebab ubinnya mati tidak pernah sampai kepada mereka.
       * Hover sendiri tidak bisa dipercaya di Chrome headless: CDP
       * mengirim `mouseMoved`, tapi `pointerenter` yang ditunggu
       * reka-ui tidak ikut terpicu, jadi "gagal" di sini tidak akan
       * berarti apa-apa.
       *
       * Dimuat ulang dulu: pemeriksaan klik di atas menutup tooltip
       * lewat `pointerdown`, dan reka-ui menahannya tetap tertutup
       * sampai penunjuk benar-benar meninggalkan pemicunya — di
       * headless itu tidak pernah terjadi, jadi yang gagal di sini
       * adalah sisa pemeriksaan sebelumnya, bukan tooltipnya.
       */
      await goto(cdp, `${BASE}/`, 6000)

      // Kursor digerakkan ke atas ubinnya lewat `Input` domain — bukan
      // `dispatchEvent` dari JS, yang tidak menghasilkan urutan pointer
      // yang ditunggu reka-ui — lalu ubinnya difokuskan. Keduanya
      // adalah dua jalur yang dipakai pengguna sungguhan.
      const spot = await evaluate(cdp, `
        (() => {
          const box = document
            .querySelector('[data-slot="application-launcher-item"][data-enabled="false"]')
            .getBoundingClientRect()

          return { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) }
        })()
      `)

      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: spot.x,
        y: spot.y,
        buttons: 0,
        pointerType: 'mouse',
      })

      await sleep(600)

      await evaluate(cdp, `
        (() => {
          document.querySelector('[data-slot="application-launcher-item"][data-enabled="false"]').focus()
          return true
        })()
      `)

      await sleep(1200)

      const tip = await evaluate(cdp, `
        (() => {
          const node = document.querySelector('[data-slot="tooltip-content"]')
          const item = document.querySelector('[data-slot="application-launcher-item"][data-enabled="false"]')
          return {
            tooltip: node ? node.innerText.trim() : '',
            label: item.getAttribute('aria-label') || '',
            state: item.getAttribute('data-state') || '',
          }
        })()
      `)

      // Bunyinya dicocokkan dengan katalog i18n — dua bahasa, dan
      // keduanya sah. Yang salah adalah kalimat yang tidak ada di
      // katalog mana pun, karena itu berarti ditulis di komponen.
      const known = [
        "You don't have access to this application.",
        'Anda tidak memiliki akses ke aplikasi ini.',
        'This application is not available yet.',
        'Aplikasi ini belum tersedia.',
        'Coming soon',
        'Segera hadir',
        'Maintenance',
        'Pemeliharaan',
        'Beta',
      ]

      log('Tooltip sebab muncul saat ubin difokuskan papan ketik',
        known.some(text => tip.tooltip.includes(text)),
        `tooltip="${tip.tooltip}" state=${tip.state}`)

      log('Pembaca layar mendapat sebabnya lewat aria-label',
        known.some(text => tip.label.includes(text)),
        `aria-label="${tip.label}"`)
    }

    // --- 6. aplikasi aktif tetap bisa dibuka ------------------------
    if (shouldBeEnabled.length) {
      const target = shouldBeEnabled[0]

      await goto(cdp, `${BASE}/`, 6000)

      await evaluate(cdp, `
        (() => {
          const node = document.querySelector('a[href="${target.link}"]')
          node.click()
          return true
        })()
      `)

      await sleep(2500)

      const landed = await evaluate(cdp, 'location.pathname')

      log('Aplikasi aktif tetap bisa dibuka',
        landed.startsWith(target.link),
        `${target.app_code} -> ${landed}`)
    }

    // --- 7. responsif ------------------------------------------------
    for (const [w, h, name] of [[1440, 1000, 'desktop'], [1024, 900, 'laptop'], [820, 1000, 'tablet'], [390, 844, 'mobile']]) {
      await viewport(cdp, w, h)
      await goto(cdp, `${BASE}/`, 6000)

      const view = await evaluate(cdp, READ)

      log(`Tanpa overflow mendatar (${w})`, view.overflow <= 0, `selisih=${view.overflow} kolom=${view.cols}`)

      log(`Seluruh katalog tetap tampil (${w})`,
        view.items.length === expected.length,
        `ubin=${view.items.length}`)

      console.log('  screenshot:', await shot(cdp, `launcher-${name}-${w}`))
    }
  }
  finally {
    cdp.close()
    chrome.kill()
  }

  console.log(failed ? `\n${failed} pemeriksaan GAGAL` : '\nSemua pemeriksaan lolos')
  process.exit(failed ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
