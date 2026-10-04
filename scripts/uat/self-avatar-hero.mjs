/*
 * UAT browser — foto pegawai di kepala dashboard `/me`, kepala halaman
 * pegawai, dan baris tabel.
 *
 * **Tidak menulis apa pun.** Kedua keadaan yang diuji sudah ada di
 * tenant peragaan: `demo.gm` (Adrian, punya foto) dan `demo.hostaff`
 * (Bimo, belum punya). Tidak ada unggahan, tidak ada PATCH, tidak ada
 * pembersihan yang bisa salah sasaran.
 *
 *     node scripts/uat/self-avatar-hero.mjs
 *
 * Yang diperiksa: sumber fotonya (`/api/me/avatar/`, bukan `preview/`
 * milik HR), ukurannya (64/56/32 px), bentuknya (bulat, object-cover),
 * cadangan inisial, mode gelap, layar sempit, dan gambar yang gagal
 * dimuat.
 */
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import WebSocket from 'ws'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9339
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT
  ?? path.join(os.tmpdir(), 'meinova-uat-self-avatar-hero')
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

const report = []

function log(label, ok, detail = '') {
  report.push({ label, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
}

const WITH_PHOTO = process.env.UAT_USER_PHOTO ?? 'demo.gm'
const WITHOUT_PHOTO = process.env.UAT_USER_PLAIN ?? 'demo.hostaff'

/** Avatar pertama di dalam kartu hero `/me`. */
const READ_HERO = `
  (() => {
    const heading = document.querySelector("h2")
    const card = heading && heading.closest("[data-slot=card]")
    const avatar = card && card.querySelector("[data-slot=avatar]")
    if (!avatar) return { found: false, heading: heading ? heading.innerText.trim() : null }
    const img = avatar.querySelector("img")
    const box = avatar.getBoundingClientRect()
    const style = getComputedStyle(avatar)
    const fallback = avatar.querySelector("[data-slot=avatar-fallback]")
    return {
      found: true,
      name: heading.innerText.trim(),
      width: Math.round(box.width),
      height: Math.round(box.height),
      radius: style.borderTopLeftRadius,
      hasImage: Boolean(img),
      loaded: img ? img.complete && img.naturalWidth > 0 : false,
      src: img ? img.getAttribute("src") : null,
      objectFit: img ? getComputedStyle(img).objectFit : null,
      initials: fallback ? fallback.innerText.trim() : null,
      role: avatar.getAttribute("role"),
      cursor: style.cursor,
      ariaLabel: avatar.getAttribute("aria-label"),
      fallbackVisible: fallback ? getComputedStyle(fallback).display !== "none" : false,
      brokenIcons: [...document.querySelectorAll("img")]
        .filter(i => i.complete && i.naturalWidth === 0 && getComputedStyle(i).display !== "none").length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    }
  })()
`

async function login(cdp, username, password) {
  const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })).json()

  if (!auth.access)
    throw new Error(`Login ${username} gagal: ${JSON.stringify(auth)}`)

  await goto(cdp, `${BASE}/`, 2000)
  await cdp.send('Network.clearBrowserCookies')

  for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]])
    await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })

  return auth
}

async function waitFor(cdp, expression, timeoutMs = 12000) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    if (await evaluate(cdp, expression))
      return true
    await sleep(300)
  }
  return false
}

function requestsOf(cdp) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .map(e => e.params.request.url)
}

/** Isi lightbox `MImagePreviewDialog`, apa pun yang membukanya. */
const READ_DIALOG = `
  (() => {
    const dlg = document.querySelector("[data-slot=dialog-content]")
    if (!dlg) return { open: false }
    const img = dlg.querySelector("img")
    const box = dlg.getBoundingClientRect()
    return {
      open: true,
      title: (dlg.querySelector("[data-slot=dialog-title]") || dlg.querySelector("h2") || {}).innerText || "",
      width: Math.round(box.width),
      height: Math.round(box.height),
      loaded: img ? img.complete && img.naturalWidth > 0 : false,
      src: img ? img.getAttribute("src") : null,
      objectFit: img ? getComputedStyle(img).objectFit : null,
      imgWidth: img ? Math.round(img.getBoundingClientRect().width) : 0,
      imgHeight: img ? Math.round(img.getBoundingClientRect().height) : 0,
      hasDownload: [...dlg.querySelectorAll("button")].some(b => b.innerText.trim() === "Download"),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    }
  })()
`

/**
 * Klik sungguhan di tengah elemen — bukan `el.click()`.
 *
 * Yang diuji di sini justru apakah elemennya memang menerima klik
 * pengguna; `el.click()` memanggil handler-nya walau elemennya tertutup
 * atau tidak interaktif sama sekali.
 */
async function clickElement(cdp, selectorJs) {
  const box = await evaluate(cdp, `
    (() => {
      const el = ${selectorJs}
      if (!el) return null
      el.scrollIntoView({ block: "center" })
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return null
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `)

  if (!box)
    return false

  for (const type of ['mousePressed', 'mouseReleased'])
    await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 })

  await sleep(500)

  return true
}

async function pressEscape(cdp) {
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await sleep(600)
}

const HERO_AVATAR = `document.querySelector("h2")?.closest("[data-slot=card]")?.querySelector("[data-slot=avatar]")`
const HEADER_AVATAR = `document.querySelector("h1.text-xl")?.closest(".rounded-lg")?.querySelector("[data-slot=avatar]")`

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

    // --- 1. pegawai BERFOTO: foto tampil di hero -------------------------
    await login(cdp, WITH_PHOTO, PASS)
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me`, 9000)
    // Nuxt dev mengompilasi rute saat pertama dibuka; kartu hero bisa
    // datang belakangan. Tunggu kartunya, jangan tunggu detik.
    if (!await waitFor(cdp, `Boolean(document.querySelector("h2")?.closest("[data-slot=card]"))`, 30000))
      console.log('   diagnosa:', await evaluate(cdp, `location.pathname + " | " + document.body.innerText.slice(0, 120).replace(/\n/g, " ")`))
    await waitFor(cdp, `(() => { const i = document.querySelector("h2")?.closest("[data-slot=card]")?.querySelector("[data-slot=avatar] img"); return !!(i && i.naturalWidth > 0) })()`)

    let hero = await evaluate(cdp, READ_HERO)
    await shot(cdp, '1-me-hero-photo')

    log('1. Hero /me menampilkan foto pegawai', hero.found && hero.loaded, `${hero.name} ${JSON.stringify({ w: hero.width, h: hero.height, src: String(hero.src).slice(0, 12) })}`)
    log('1. Ukurannya 64×64', hero.width === 64 && hero.height === 64, `${hero.width}×${hero.height}`)
    // `rounded-full` dihitung peramban jadi radius raksasa (mis.
    // 3.3e+07px), bukan persen — `parseInt` pada notasi itu memberi 3.
    log('1. Bulat', hero.radius.includes('%') || Number.parseFloat(hero.radius) >= 32, `radius=${hero.radius}`)
    log('1. object-fit: cover', hero.objectFit === 'cover', String(hero.objectFit))

    const avatarCalls = cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/api/me/avatar/'))
      .map(e => `${e.params.request.method} ${e.params.type ?? ''}`)
    console.log('   panggilan /api/me/avatar/:', avatarCalls.join(' | '))

    const urls = requestsOf(cdp)
    const selfAvatar = cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent'
        && e.params.request.url.includes('/api/me/avatar/')
        && e.params.request.method !== 'OPTIONS')
      .map(e => e.params.request.url)
    const hrPreview = urls.filter(u => u.includes('/api/uploads/'))
    log('1. Sumbernya /api/me/avatar/ — bukan preview/ milik HR',
      selfAvatar.length === 1 && hrPreview.length === 0,
      `me/avatar=${selfAvatar.length} uploads=${hrPreview.length}`)
    log('1. Dipasang sebagai blob: (diambil bertoken)', String(hero.src).startsWith('blob:'))
    log('1. Tanpa ikon gambar rusak', hero.brokenIcons === 0)

    // --- 1b. klik foto hero → lightbox ----------------------------------
    log('1b. Foto hero ditandai bisa diklik',
      hero.role === 'button' && hero.cursor === 'zoom-in' && String(hero.ariaLabel).includes(hero.name),
      `role=${hero.role} cursor=${hero.cursor} label=${hero.ariaLabel}`)

    cdp.events.length = 0
    const clicked = await clickElement(cdp, HERO_AVATAR)
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)

    const box = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '1b-me-hero-lightbox')

    log('1b. Klik foto membuka dialog di halaman yang sama',
      clicked && box.open
      && (await cdp.send('Target.getTargets')).targetInfos.filter(t => t.type === 'page').length === 1,
      `lebar=${box.width}px tinggi=${box.height}px`)
    log('1b. Ukurannya terkendali: ≤950px dan ≤90vw di desktop',
      box.width <= 950 && box.width <= Math.round(1600 * 0.9) && box.height <= Math.round(1100 * 0.9),
      `${box.width}×${box.height} pada layar 1600×1100`)
    log('1b. Gambarnya utuh (object-contain), bukan dipotong',
      box.loaded && box.objectFit === 'contain',
      `fit=${box.objectFit} gambar=${box.imgWidth}×${box.imgHeight}`)
    log('1b. Memakai blob yang sudah ada — tanpa /api/me/avatar/ kedua',
      String(box.src).startsWith('blob:')
      && cdp.events.filter(e => e.method === 'Network.requestWillBeSent'
        && e.params.request.url.includes('/api/me/avatar/')).length === 0,
      `src=${String(box.src).slice(0, 12)} permintaan=${cdp.events.filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/api/me/avatar/')).length}`)
    log('1b. Judulnya nama pegawainya', box.title.trim() === hero.name, box.title.trim())
    log('1b. Tanpa tombol Download (penampil foto, bukan kelola berkas)', !box.hasDownload)
    log('1b. Tanpa scroll horizontal', !box.overflow)

    await pressEscape(cdp)
    log('1b. Escape menutup', !(await evaluate(cdp, READ_DIALOG)).open)

    // Buka lagi, tutup dengan tombol X.
    await clickElement(cdp, HERO_AVATAR)
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    const reopened = (await evaluate(cdp, READ_DIALOG)).open
    await clickElement(cdp, `document.querySelector("[data-slot=dialog-content]")?.querySelector("button")`)
    await sleep(600)
    log('1b. Dibuka lagi, tombol X menutup',
      reopened && !(await evaluate(cdp, READ_DIALOG)).open)

    // --- 2. mode gelap ----------------------------------------------------
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] })
    await goto(cdp, `${BASE}/me`, 7000)
    await waitFor(cdp, `Boolean(document.querySelector("h2")?.closest("[data-slot=card]"))`, 20000)
    await waitFor(cdp, `(() => { const i = document.querySelector("h2")?.closest("[data-slot=card]")?.querySelector("[data-slot=avatar] img"); return !!(i && i.naturalWidth > 0) })()`)
    const dark = await evaluate(cdp, READ_HERO)
    const darkBg = await evaluate(cdp, `getComputedStyle(document.body).backgroundColor`)
    await shot(cdp, '2-me-hero-dark')
    log('2. Mode gelap: foto tetap tampil, ukuran tetap',
      dark.loaded && dark.width === 64 && dark.brokenIcons === 0, `bg=${darkBg}`)
    await cdp.send('Emulation.setEmulatedMedia', { features: [] })

    // --- 3. layar sempit --------------------------------------------------
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
    })
    await goto(cdp, `${BASE}/me`, 7000)
    await waitFor(cdp, `Boolean(document.querySelector("h2")?.closest("[data-slot=card]"))`, 20000)
    await waitFor(cdp, `(() => { const i = document.querySelector("h2")?.closest("[data-slot=card]")?.querySelector("[data-slot=avatar] img"); return !!(i && i.naturalWidth > 0) })()`)
    const mobile = await evaluate(cdp, READ_HERO)
    await shot(cdp, '3-me-hero-mobile')
    log('3. Layar 390px: proporsional, tanpa scroll horizontal',
      mobile.loaded && mobile.width === 64 && !mobile.overflow,
      `${mobile.width}px overflow=${mobile.overflow}`)

    await clickElement(cdp, HERO_AVATAR)
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)
    const mobileBox = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '3b-me-hero-lightbox-mobile')
    log('3b. Ponsel 390px: pratinjau foto muat, tanpa scroll horizontal',
      mobileBox.open && mobileBox.loaded && mobileBox.width <= 390 && !mobileBox.overflow,
      `dialog=${mobileBox.width}px gambar=${mobileBox.imgWidth}×${mobileBox.imgHeight} overflow=${mobileBox.overflow}`)
    await pressEscape(cdp)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false,
    })

    // --- 4. foto gagal dimuat → inisial, bukan kotak rusak ----------------
    await cdp.send('Network.setBlockedURLs', { urls: ['*/api/me/avatar/*'] })
    await goto(cdp, `${BASE}/me`, 8000)
    await waitFor(cdp, `Boolean(document.querySelector("h2")?.closest("[data-slot=card]"))`, 20000)
    const broken = await evaluate(cdp, READ_HERO)
    await shot(cdp, '4-me-hero-blocked')
    log('4. Foto gagal dimuat → inisial, tanpa ikon rusak',
      broken.found && !broken.loaded && broken.fallbackVisible && broken.brokenIcons === 0,
      `initials=${broken.initials}`)
    await clickElement(cdp, HERO_AVATAR)
    await sleep(700)
    log('4. Yang jatuh ke inisial tidak bisa diklik',
      broken.role === null && broken.cursor !== 'zoom-in'
      && !(await evaluate(cdp, READ_DIALOG)).open,
      `role=${broken.role} cursor=${broken.cursor}`)
    await cdp.send('Network.setBlockedURLs', { urls: [] })

    // --- 5. pegawai TANPA foto: inisial, tanpa permintaan foto ------------
    await login(cdp, WITHOUT_PHOTO, PASS)
    cdp.events.length = 0
    await goto(cdp, `${BASE}/me`, 9000)
    await waitFor(cdp, `Boolean(document.querySelector("h2")?.closest("[data-slot=card]"))`, 20000)
    const plain = await evaluate(cdp, READ_HERO)
    await shot(cdp, '5-me-hero-initials')
    const plainAvatarCalls = requestsOf(cdp).filter(u => u.includes('/api/me/avatar/'))
    log('5. Tanpa foto → inisial di hero', plain.found && !plain.loaded && Boolean(plain.initials), `${plain.name} → ${plain.initials}`)
    log('5. Ukurannya tetap 64×64', plain.width === 64 && plain.height === 64, `${plain.width}×${plain.height}`)
    log('5. Tanpa foto = nol permintaan foto (tanpa N+1)', plainAvatarCalls.length === 0, `${plainAvatarCalls.length} permintaan`)

    await clickElement(cdp, HERO_AVATAR)
    await sleep(700)
    log('5. Inisial bukan tombol — klik tidak membuka apa pun',
      plain.role === null && plain.cursor !== 'zoom-in'
      && !(await evaluate(cdp, READ_DIALOG)).open,
      `role=${plain.role} cursor=${plain.cursor}`)

    // --- 6. layar HR: kepala 56px, baris tabel 32px -----------------------
    await login(cdp, USER, PASS)
    const withPhoto = await (await fetch(`${API}/api/hr/employees/?search=HO006`, {
      headers: { Authorization: `Bearer ${(await (await fetch(`${API}/api/accounts/auth/login/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: USER, password: PASS }) })).json()).access}` },
    })).json()
    const row = (withPhoto.data ?? withPhoto.results ?? withPhoto)[0]

    cdp.events.length = 0
    await goto(cdp, `${BASE}/hr/employees/${row.id}`, 9000)
    await waitFor(cdp, `(() => { const i = document.querySelector("h1.text-xl")?.closest(".rounded-lg")?.querySelector("[data-slot=avatar] img"); return !!(i && i.naturalWidth > 0) })()`)
    const header = await evaluate(cdp, `
      (() => {
        const avatar = document.querySelector("h1.text-xl").closest(".rounded-lg").querySelector("[data-slot=avatar]")
        const img = avatar.querySelector("img")
        const box = avatar.getBoundingClientRect()
        return {
          width: Math.round(box.width),
          loaded: img ? img.naturalWidth > 0 : false,
          objectFit: img ? getComputedStyle(img).objectFit : null,
          headerHeight: Math.round(document.querySelector("h1.text-xl").closest(".rounded-lg").getBoundingClientRect().height),
        }
      })()
    `)
    await shot(cdp, '6-employee-header-56')
    log('6. Kepala Detail pegawai 56px, foto termuat',
      header.width === 56 && header.loaded && header.objectFit === 'cover',
      `${header.width}px fit=${header.objectFit} tinggi kepala=${header.headerHeight}px`)
    const headerPreview = requestsOf(cdp).filter(u => u.includes('/preview/'))
    log('6. Layar HR memakai preview/ pegawai (bukan /api/me/avatar/)',
      headerPreview.length > 0 && requestsOf(cdp).filter(u => u.includes('/api/me/avatar/')).length === 0,
      `${headerPreview.length} preview/`)

    // --- 6b. klik foto kepala Detail → lightbox yang sama ----------------
    const headerAvatar = await evaluate(cdp, `
      (() => {
        const a = document.querySelector("h1.text-xl")?.closest(".rounded-lg")?.querySelector("[data-slot=avatar]")
        if (!a) return null
        const s = getComputedStyle(a)
        return { role: a.getAttribute("role"), cursor: s.cursor, label: a.getAttribute("aria-label") }
      })()
    `)
    log('6b. Foto 56px ditandai bisa diklik',
      headerAvatar && headerAvatar.role === 'button' && headerAvatar.cursor === 'zoom-in',
      `role=${headerAvatar?.role} cursor=${headerAvatar?.cursor} label=${headerAvatar?.label}`)

    cdp.events.length = 0
    await clickElement(cdp, HEADER_AVATAR)
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)
    const headerBox = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '6b-employee-header-lightbox')

    log('6b. Klik foto pegawai membuka lightbox yang sama',
      headerBox.open && headerBox.loaded && headerBox.objectFit === 'contain',
      `lebar=${headerBox.width}px fit=${headerBox.objectFit} judul=${headerBox.title.trim()}`)
    log('6b. Memakai blob yang sudah ada — tanpa preview/ kedua',
      String(headerBox.src).startsWith('blob:')
      && cdp.events.filter(e => e.method === 'Network.requestWillBeSent'
        && e.params.request.url.includes('/preview/')).length === 0,
      `src=${String(headerBox.src).slice(0, 12)}`)
    log('6b. Tanpa tombol Download, tanpa Replace/Remove',
      !headerBox.hasDownload
      && !(await evaluate(cdp, `(() => { const d = document.querySelector("[data-slot=dialog-content]"); return d ? /Replace|Remove/.test(d.innerText) : false })()`)))
    await pressEscape(cdp)
    log('6b. Escape menutup', !(await evaluate(cdp, READ_DIALOG)).open)

    cdp.events.length = 0
    await goto(cdp, `${BASE}/hr/employees`, 10000)
    const list = await evaluate(cdp, `
      (() => [...document.querySelectorAll("tbody tr")].map((tr) => {
        const a = tr.querySelector("[data-slot=avatar]")
        if (!a) return null
        const img = a.querySelector("img")
        return { w: Math.round(a.getBoundingClientRect().width), loaded: img ? img.naturalWidth > 0 : false }
      }).filter(Boolean))()
    `)
    await shot(cdp, '7-employee-list-32')
    log('7. Baris tabel pegawai 32px', list.length > 0 && list.every(r => r.w === 32), `${list.length} baris`)
    log('7. Yang berfoto tetap termuat di tabel', list.some(r => r.loaded))

    const listInteractive = await evaluate(cdp, `
      (() => [...document.querySelectorAll("tbody tr [data-slot=avatar]")].map((a) => ({
        role: a.getAttribute("role"),
        cursor: getComputedStyle(a).cursor,
      })))()
    `)
    log('7b. Baris daftar TIDAK bisa diklik fotonya (sengaja)',
      listInteractive.length > 0
      && listInteractive.every(a => a.role === null && a.cursor !== 'zoom-in')
      && !(await evaluate(cdp, READ_DIALOG)).open,
      `${listInteractive.length} avatar, role=${[...new Set(listInteractive.map(a => String(a.role)))].join(',')}`)
  }
  finally {
    cdp.close()
    chrome.kill()
  }

  const failed = report.filter(r => !r.ok)
  console.log(`\n${report.length - failed.length}/${report.length} lolos. Screenshot: ${OUT}`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
