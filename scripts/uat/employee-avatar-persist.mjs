/*
 * UAT browser — foto pegawai tersimpan: form Edit, kepala halaman, daftar.
 *
 * Melengkapi `employee-avatar.mjs` (yang hanya bisa memeriksa inisial,
 * karena tenant peragaan belum punya satu pun foto). Yang ini
 * mengunggah foto **lewat form Edit sungguhan** — `<input type=file>`
 * milik widget unggah, lalu tombol Save — sehingga seluruh jalurnya
 * ikut teruji: kategori unggahan, id yang ikut PATCH, dan payload
 * baca yang menampilkannya kembali.
 *
 * Jalankan (Nuxt di :3000 dan Django di :8000 harus hidup):
 *
 *     node scripts/uat/employee-avatar-persist.mjs
 *
 * Mengubah data tenant peragaan selama berjalan, lalu **memulihkannya**:
 * `avatar_file` pegawai sasaran dikembalikan ke nilai semula dan kedua
 * berkas uji di-purge.
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_USER, UAT_PASS, UAT_OUT,
 * UAT_EMPLOYEE (nomor pegawai sasaran, bawaan SGA004).
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
const PORT = 9337
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT
  ?? path.join(os.tmpdir(), 'meinova-uat-employee-avatar-persist')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}

const TARGET = process.env.UAT_EMPLOYEE ?? 'SGA004'

// Dua foto potret 240×320 berbeda warna — potret, supaya
// `object-fit: cover` benar-benar diuji pada kotak bulat.
const PHOTO_A = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAFACAIAAAANimYEAAAFlElEQVR4nO3awU1cWRBAUTyaYH4QBOMgHIaDcDgO4Yczi5FGyG0YwA3ddeuctRfv1bsqvsBffj4+PkDFX7c+AFyToEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCl/3/oAQceP76//x+fXbx95lnW+/Hx8vPUZdhX8Mn3/IUHfRceXlP0+gr6vji8p+00EfacdX1L2awh6QMpPyfplgh6T8lOyfo6gh6X8lKwv+cPK1JoHnfMz2dCFRKzq/9jQ42seffKrE3SkiennvxafHLUUzt3/OWT7ho7V/FC80ZusDrr69kf0Xq+xN+j2qx/p271gadAb3vtYcMdLG4Pe89LHmpvuDXrbGx/L7rsr6G2vu/DWi4Je9a5r774l6D0vunwCK4Je8pb/a8McVgTNHv2gN6yl1zvq04gHnX+/dzjSMykH3X65P3F0J1MOmoWyQYeX0FUc0fk0g66+1nUdxSk1g2atYNDJxfNBjtysgkGzWS3o3sr5aEdrYrWgWS4VdGzZfJojNLdU0NAJurRmPt9RmV4naOgEnVkwN3QkZhgJGjpBN1bLPTjmT7IQNPxH0KSMDzrwU/KuHMPnOT5oeErQpMwOevrPx/t0TJ7q7KDhF4ImRdCkDA569KfenTvGznZw0HBJ0KQImpSpQc/9yJvimDnhqUHDbwmaFEGTImhSBE2KoEkZGfTQ3yiNcwyc88ig4TmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkZGfT59dutj7DCOXDOI4OG5wiaFEGTImhSBE2KoEmZGvTE3yjNcs6c8NSg4bcETYqgSRkc9NCPvBHOsbMdHDRcEjQpgiZldtBzP/Xu2Tl5qrODhl8ImpTxQY/++XiHzuHzHB80PCVoUgpBT/8peT/O+ZMsBA21oAOr5ebOxAwjQUMt6MaCuZWzMr1O0FALOrNmPtkZmlsqaKgFXVo2n+NsTawWNMsFg46tnA915mYVDJrNmkH3Fs9HOItTagZdfa0rOqPzyQbNTuWgq0voz53dyZSDbr/cu53pmcSDzr/fW531afSDZpUVQefX0iudC+awIuglb/myJRPYEvSeF11+90VBr3rXtbfeFfS2133Yd991Qa9643PNTVcHveSlzwV3vLQ06Px7n+nbvWBv0OFXP6P3eo3VQSff/szd6E2+/Hx8vPUZ7sLx4/vDcOfulP+1fUNnaph+/msRdKGJuSe/Op8csz8/pPwLG3pwJVPO+Zls6JGrWsrPEfSwrKX8MkGPyVrKryHoey9bx28i6DstW8fvI+j7KlvHf0jQN+5bwdclaFL8YYUUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0DyX/AE37An42Qa7KAAAAAElFTkSuQmCC'
const PHOTO_B = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAFACAIAAAANimYEAAAFkklEQVR4nO3ZS24bVxBAUSXwYrKEXksW44FX18vKIEAgSBajD0Wybp0ztqV+VRePDeqPv/4+n6Diz3s/AFyToEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCk/7v0AQeevD/zj4+c3PslCgr51wZf/r76/SND36fh/f6ayP0fQD9Hxhd+i7A8R9GN1fOH3Kvs9BP24Kf/2MWR9maAHpPycrC8T9JiUn5P1W/xhZV7N457zltzQsxNxVb/ghh5cc+DJr07QkSamP/+1eOXopHD6Xs8Nnak5fKIPWf3KUd39GT3Xe+wNur31M326C5YGvWHf54IzvrYx6D2bPtecdG/Q23Z8LjvvrqC3bXfhqRcFvWqva8++Jeg9G10+gRVBL9nl/9owhxVBs0c/6A3X0vud9WnEg87v7xPO9EzKQbc39xVndzLloFkoG3T4ErqKMzqfZtDVbV3XWZxSM2jWCgadvHi+yZmbVTBoNqsF3btyvtvZmlgtaJZLBR27bG7mDM0tFTR0gi5dM7d3VqbXCRo6QWcumDs6EzOMBA2doBtXyyM450+yEDT8R9CkjA868Cn5UM7h8xwfNDwnaFJmBz398/ExnZOnOjtoeEHQpAialMFBj37Ve3Dn2NkODhpeEzQpgiZlatBzX/KmOGdOeGrQ8FuCJkXQpAiaFEGTImhSRgY99Bulcc6Bcx4ZNLxF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpI4M+ft77CXY4Bs55ZNDwFkGTImhSBE2KoEkRNClTg574jdIsx8wJTw0afkvQpAialMFBD33JG+EYO9vBQcNrgiZF0KTMDnruq94jOyZPdXbQ8IKgSRkf9OjPxwd0DJ/n+KDhOUGTUgh6+qfk4zjmT7IQNNSCDlwtd3ckZhgJGmpBNy6Yezkq0+sEDbWgM9fMjR2huaWChlrQpcvmNo7WxGpBs1ww6NiV862O3KyCQbNZM+jexfMdjuKUmkFXt3VFR3Q+2aDZqRx09RL6uqM7mXLQ7c192pGeSTzo/P4+6qhPox80q6wIOn8tvdOxYA4rgl6yy8uWTGBL0Hs2uvzsi4Jetde1p94V9LbtPu0777qgV+34WHPS1UEv2fSx4IyvLQ06v+8jfboL9gYd3voRPdd7rA46ufsjd6IP+XHvB3iUAs5fT9Mdu1P+1/YbOlPD9Oe/FkEXmpj75FfnlWP264eUX3BDD65kynPekht65FUt5bcIeljWUr5M0GOylvJ7CPrDPd24bB1/iKAftGwdf46gH6tsHX+RoK9f4Yf6VvB1Cfr6NHpH/rBCiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImqeSfwAMW7CopAA4yQAAAABJRU5ErkJggg=='
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

/*
 * Membaca satu avatar/pratinjau: apakah ia `<img>` yang benar-benar
 * termuat (naturalWidth > 0), dari mana src-nya, dan ukurannya.
 */
function READ_IMAGE(selector) {
  return `
    (() => {
      const root = document.querySelector(${JSON.stringify(selector)})
      if (!root) return { found: false }
      const img = root.querySelector("img")
      const box = root.getBoundingClientRect()
      return {
        found: true,
        width: Math.round(box.width),
        height: Math.round(box.height),
        hasImage: Boolean(img),
        loaded: img ? img.complete && img.naturalWidth > 0 : false,
        src: img ? img.getAttribute("src") : null,
        objectFit: img ? getComputedStyle(img).objectFit : null,
        text: root.innerText.trim(),
      }
    })()
  `
}

const READ_HEADER = `
  (() => {
    const h1 = document.querySelector("h1.text-xl")
    if (!h1) return { found: false }
    const header = h1.closest(".rounded-lg")
    const avatar = header && header.querySelector("[data-slot=avatar]")
    if (!avatar) return { found: true, avatar: false, title: h1.innerText.trim() }
    const img = avatar.querySelector("img")
    const box = avatar.getBoundingClientRect()
    return {
      found: true,
      avatar: true,
      title: h1.innerText.trim(),
      width: Math.round(box.width),
      headerHeight: Math.round(header.getBoundingClientRect().height),
      loaded: img ? img.complete && img.naturalWidth > 0 : false,
      src: img ? img.getAttribute("src") : null,
      objectFit: img ? getComputedStyle(img).objectFit : null,
      initials: (avatar.querySelector("[data-slot=avatar-fallback]") || {}).innerText || null,
    }
  })()
`

const READ_BROKEN = `
  [...document.querySelectorAll("img")]
    // Yang tersembunyi (display:none) bukan ikon rusak yang terlihat:
    // reka menyembunyikan <img> yang gagal dan menampilkan inisialnya.
    .filter(i => i.complete && i.naturalWidth === 0 && getComputedStyle(i).display !== "none")
    .map(i => (i.getAttribute("src") || "(tanpa src)") + " alt=" + i.alt)
`

async function waitFor(cdp, expression, timeoutMs = 15000) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    if (await evaluate(cdp, expression))
      return true
    await sleep(300)
  }
  return false
}

async function clickButton(cdp, text) {
  const box = await evaluate(cdp, `
    (() => {
      const b = [...document.querySelectorAll("button")]
        .find(n => n.innerText.trim() === ${JSON.stringify(text)} && !n.disabled)
      if (!b) return null
      b.scrollIntoView({ block: "center" })
      const r = b.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `)
  if (!box)
    return false
  for (const type of ['mousePressed', 'mouseReleased'])
    await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 })
  return true
}

async function chooseFile(cdp, file) {
  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true })
  const { nodeId } = await cdp.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: '[data-field-key=avatar_file] input[type=file]',
  })
  if (!nodeId)
    return false
  await cdp.send('DOM.setFileInputFiles', { nodeId, files: [file] })
  return true
}

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  const photoA = path.join(OUT, 'photo-a.png')
  const photoB = path.join(OUT, 'photo-b.png')
  await fs.writeFile(photoA, Buffer.from(PHOTO_A, 'base64'))
  await fs.writeFile(photoB, Buffer.from(PHOTO_B, 'base64'))

  const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USER, password: PASS }),
  })).json()

  if (!auth.access)
    throw new Error(`Login API gagal: ${JSON.stringify(auth)}`)

  const api = async (url, init = {}) => {
    const res = await fetch(`${API}${url}`, {
      ...init,
      headers: { 'Authorization': `Bearer ${auth.access}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    })
    return { status: res.status, body: res.status === 204 ? null : await res.json().catch(() => null) }
  }

  const rows = (await api(`/api/hr/employees/?search=${TARGET}`)).body
  const target = (rows.data ?? rows.results ?? rows).find(r => r.employee_number === TARGET)

  if (!target)
    throw new Error(`Pegawai ${TARGET} tidak ditemukan`)

  const original = target.avatar_file ?? null
  const startedAt = new Date(Date.now() - 5000).toISOString()

  /*
   * Hanya pada pegawai TANPA foto. Skrip ini memulihkan data dengan
   * mengosongkan foto dan mem-purge berkas uji; pada pegawai yang sudah
   * berfoto, berkas milik orang lain ikut terhapus (pernah terjadi:
   * purge sebagai superuser melewati penjagaan "berkas tertaut").
   */
  if (original !== null) {
    console.error(`Pegawai ${TARGET} sudah punya foto (avatar_file=${original}). `
      + 'UAT ini tidak menyentuh data yang bukan buatannya — pilih UAT_EMPLOYEE lain.')
    process.exit(2)
  }

  // Hanya berkas yang diunggah run ini, dikenali dari public_id-nya.
  const uploaded = new Set()

  const chrome = await launch()
  const cdp = await attach()

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  await cdp.send('Network.enable')
  await cdp.send('DOM.enable')

  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false,
    })

    await goto(cdp, `${BASE}/`, 3000)
    for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]])
      await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })

    const editUrl = `${BASE}/hr/employees/${target.id}/edit`
    const detailUrl = `${BASE}/hr/employees/${target.id}`

    // --- 1. tanpa foto: inisial di kepala halaman ----------------------
    await goto(cdp, editUrl, 9000)
    let header = await evaluate(cdp, READ_HEADER)
    log('1. Kepala halaman punya avatar', header.avatar === true, JSON.stringify(header))
    log('1. Tanpa foto → inisial', !header.src && header.initials === target.avatar_display.initials,
      `initials=${header.initials}`)

    // --- 2. unggah lewat form, lalu Save --------------------------------
    log('2. Input berkas foto ada di form', await chooseFile(cdp, photoA))
    const previewSel = '[data-field-key=avatar_file] .rounded-lg.border.p-3 > div:first-child'
    const uploadedOk = await waitFor(cdp,
      `(() => { const f = document.querySelector("[data-field-key=avatar_file]"); const i = document.querySelector("${previewSel} img"); return !!(f && !/Uploading/.test(f.innerText) && f.innerText.includes("photo-a.png") && i && i.complete && i.naturalWidth > 0) })()`)
    let preview = await evaluate(cdp, READ_IMAGE(previewSel))
    log('2. Pratinjau tampil setelah unggah', uploadedOk, JSON.stringify(preview))

    log('2. Tombol Save diklik', await clickButton(cdp, 'Save'))
    await sleep(4000)

    let fresh = (await api(`/api/hr/employees/${target.id}/`)).body
    if (fresh?.avatar_file_detail?.public_id && /^photo-[ab]\.png$/.test(fresh.avatar_file_detail.original_name ?? ''))
      uploaded.add(fresh.avatar_file_detail.public_id)
    log('2. avatar_file benar-benar tersimpan (berkas run ini)', Boolean(fresh.avatar_file) && fresh.avatar_file_detail?.original_name === 'photo-a.png',
      `avatar_file=${fresh.avatar_file} source=${fresh.avatar_display?.source}`)
    log('2. Kategori berkas = avatar', fresh.avatar_file_detail?.category === 'avatar')
    log('2. Payload tanpa jalur MEDIA', !JSON.stringify(fresh.avatar_file_detail ?? {}).includes('/media/')
      && !JSON.stringify(fresh.avatar_display ?? {}).includes('/media/'))

    const firstPublicId = fresh.avatar_file_detail?.public_id

    await waitFor(cdp, `(() => { const i = document.querySelector("h1.text-xl")?.closest(".rounded-lg")?.querySelector("[data-slot=avatar] img"); return !!(i && i.naturalWidth > 0) })()`, 8000)
    header = await evaluate(cdp, READ_HEADER)
    log('2. Kepala halaman menampilkan foto sesudah Save (tanpa muat ulang)', header.loaded, JSON.stringify(header))

    // --- 3. muat ulang: pratinjau dan kepala halaman tetap ada -----------
    cdp.events.length = 0
    await goto(cdp, editUrl, 9000)
    await waitFor(cdp, `(() => { const i = document.querySelector("${previewSel} img"); return !!(i && i.naturalWidth > 0) })()`, 8000)
    preview = await evaluate(cdp, READ_IMAGE(previewSel))
    header = await evaluate(cdp, READ_HEADER)
    await shot(cdp, '3-edit-reloaded')
    log('3. Form Edit (muat ulang) menampilkan foto tersimpan', preview.loaded, JSON.stringify(preview))
    log('3. Pratinjau memakai blob: (diambil bertoken), bukan alamat mentah', String(preview.src).startsWith('blob:'))
    log('3. Pratinjau 80px, object-fit cover', preview.width === 80 && preview.objectFit === 'cover', `${preview.width}px ${preview.objectFit}`)
    log('3. Nama berkas tampil di baris berkas', (await evaluate(cdp, `document.querySelector("[data-field-key=avatar_file]").innerText`)).includes('.png'))
    log('3. Kepala halaman: foto 56px, object-fit cover', header.loaded && header.width === 56 && header.objectFit === 'cover',
      `${header.width}px ${header.objectFit} tinggi kepala=${header.headerHeight}px`)
    const headerSrcA = header.src

    const previewRequests = cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/preview/'))
      .map(e => e.params.request.url)
    log('3. Foto yang sama diunduh sekali untuk kepala + form', new Set(previewRequests).size === 1 && previewRequests.length === 1,
      `${previewRequests.length} permintaan`)

    // --- 3b. Pratinjau / Unduh bertoken ----------------------------------
    // Tombolnya dulu `<a href target=_blank>` ke endpoint yang menuntut
    // token: tab barunya 401. Sekarang berkasnya diambil bertoken.
    await cdp.send('Target.setDiscoverTargets', { discover: true })
    const downloads = path.join(OUT, 'downloads')
    await fs.rm(downloads, { recursive: true, force: true })
    await fs.mkdir(downloads, { recursive: true })
    await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads })

    const clickTitle = async (title) => {
      const box = await evaluate(cdp, `
        (() => {
          const b = document.querySelector('[data-field-key=avatar_file] button[title="${title}"]')
          if (!b) return null
          // Field foto jauh di bawah tab General; klik mouse sintetis
          // di luar viewport tidak mengenai apa pun.
          b.scrollIntoView({ block: "center" })
          const r = b.getBoundingClientRect()
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
        })()
      `)
      if (!box)
        return false
      for (const type of ['mousePressed', 'mouseReleased'])
        await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 })
      return true
    }

    cdp.events.length = 0
    log('3b. Tombol Preview ada', await clickTitle('Preview'))
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    const fromButton = await evaluate(cdp, `
      (() => {
        const dlg = document.querySelector("[data-slot=dialog-content]")
        const img = dlg && dlg.querySelector("img")
        return { open: Boolean(dlg), loaded: img ? img.naturalWidth > 0 : false }
      })()
    `)
    const pages = (await cdp.send('Target.getTargets')).targetInfos.filter(t => t.type === 'page')
    log('3b. Preview membuka lightbox di aplikasi, bukan tab baru',
      fromButton.open && fromButton.loaded && pages.length === 1,
      `tab=${pages.length} gambar=${fromButton.loaded}`)
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await sleep(800)

    cdp.events.length = 0
    log('3b. Tombol Download ada', await clickTitle('Download'))
    let saved = []
    for (let i = 0; i < 20 && !saved.some(f => f.endsWith('.png')); i++) {
      await sleep(500)
      saved = await fs.readdir(downloads)
    }
    const downloadReq = cdp.events
      .filter(e => e.method === 'Network.responseReceived' && e.params.response.url.includes('/download/'))
      .map(e => e.params.response.status)
    const savedFile = saved.find(f => f.endsWith('.png'))
    const savedBytes = savedFile ? (await fs.readFile(path.join(downloads, savedFile))).subarray(0, 4).toString('hex') : ''
    log('3b. Download menyimpan berkas asli (PNG, nama asli)', savedFile === 'photo-a.png' && savedBytes === '89504e47' && downloadReq.every(st => st === 200),
      `berkas=${saved.join(',') || '(tidak ada)'} magic=${savedBytes} status=${downloadReq.join(',')}`)
    const bodyErr = await evaluate(cdp, `document.querySelector("[data-field-key=avatar_file]").innerText`)
    const clickErrors = cdp.events
      .filter(e => e.method === 'Runtime.exceptionThrown' || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
      .map(e => e.params?.exceptionDetails?.exception?.description ?? e.params?.entry?.text ?? JSON.stringify(e.params?.args?.map(a => a.value ?? a.description)))
    if (clickErrors.length)
      console.log('   galat konsol:', clickErrors.join(' | ').slice(0, 600))
    log('3b. Tanpa pesan galat di widget', !/could not/i.test(bodyErr))


    // --- 3c. lightbox: klik thumbnail → dialog di dalam aplikasi --------
    const READ_DIALOG = `
      (() => {
        const dlg = document.querySelector("[data-slot=dialog-content]")
        if (!dlg) return { open: false, tabs: 0 }
        const img = dlg.querySelector("img")
        const box = dlg.getBoundingClientRect()
        return {
          open: true,
          title: (dlg.querySelector("[data-slot=dialog-title]") || dlg.querySelector("h2") || {}).innerText || "",
          width: Math.round(box.width),
          hasImage: Boolean(img),
          loaded: img ? img.complete && img.naturalWidth > 0 : false,
          src: img ? img.getAttribute("src") : null,
          objectFit: img ? getComputedStyle(img).objectFit : null,
          imgHeight: img ? Math.round(img.getBoundingClientRect().height) : 0,
          hasDownload: [...dlg.querySelectorAll("button")].some(b => b.innerText.trim() === "Download"),
          overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        }
      })()
    `

    const clickThumb = async () => {
      const box = await evaluate(cdp, `
        (() => {
          const t = document.querySelector("[data-field-key=avatar_file] .rounded-lg.border.p-3 > div:first-child")
          if (!t) return null
          t.scrollIntoView({ block: "center" })
          const r = t.getBoundingClientRect()
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
        })()
      `)
      if (!box)
        return false
      for (const type of ['mousePressed', 'mouseReleased'])
        await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 })
      return true
    }

    cdp.events.length = 0
    log('3c. Thumbnail bisa diklik', await clickThumb())
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)
    const lightbox = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '3c-lightbox')

    log('3c. Dialog terbuka di halaman yang sama (tanpa tab baru)',
      lightbox.open && (await cdp.send('Target.getTargets')).targetInfos.filter(t => t.type === 'page').length === 1,
      `lebar=${lightbox.width}px`)
    log('3c. Gambarnya tampil, utuh (object-contain)',
      lightbox.loaded && lightbox.objectFit === 'contain',
      `loaded=${lightbox.loaded} fit=${lightbox.objectFit} tinggi=${lightbox.imgHeight}px`)
    log('3c. Memakai blob yang sudah ada — tanpa unduhan kedua',
      String(lightbox.src).startsWith('blob:')
      && cdp.events.filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/preview/')).length === 0,
      `src=${String(lightbox.src).slice(0, 12)}`)
    log('3c. Nama berkas tercetak di kepala dialog', lightbox.title.includes('photo-a.png'), lightbox.title)
    log('3c. Tombol Download ada di dialog', lightbox.hasDownload)

    // Escape menutup
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await sleep(800)
    log('3c. Escape menutup dialog', !(await evaluate(cdp, READ_DIALOG)).open)

    // Ponsel: dialog tetap muat, tanpa scroll horizontal
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
    await sleep(600)
    await clickThumb()
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)
    const mobileBox = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '3c-lightbox-mobile')
    log('3c. Ponsel 390px: dialog muat, tanpa scroll horizontal',
      mobileBox.open && mobileBox.width <= 390 && !mobileBox.overflow && mobileBox.loaded,
      `lebar=${mobileBox.width}px overflow=${mobileBox.overflow}`)
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false })
    await sleep(600)
    // --- 4. ganti foto ---------------------------------------------------
    log('4. Pilih foto pengganti', await chooseFile(cdp, photoB))
    await waitFor(cdp, `(() => { const f = document.querySelector("[data-field-key=avatar_file]"); const i = document.querySelector("${previewSel} img"); return !!(f && !/Uploading/.test(f.innerText) && f.innerText.includes("photo-b.png") && i && i.naturalWidth > 0) })()`)
    log('4. Tombol Save diklik', await clickButton(cdp, 'Save'))
    await sleep(4000)

    fresh = (await api(`/api/hr/employees/${target.id}/`)).body
    if (fresh?.avatar_file_detail?.public_id && /^photo-[ab]\.png$/.test(fresh.avatar_file_detail.original_name ?? ''))
      uploaded.add(fresh.avatar_file_detail.public_id)
    log('4. Berkas pengganti tersimpan (public_id baru)', fresh.avatar_file_detail?.public_id && fresh.avatar_file_detail.public_id !== firstPublicId
      && fresh.avatar_file_detail.original_name === 'photo-b.png')

    await goto(cdp, detailUrl, 9000)
    await waitFor(cdp, `(() => { const i = document.querySelector("h1.text-xl")?.closest(".rounded-lg")?.querySelector("[data-slot=avatar] img"); return !!(i && i.naturalWidth > 0) })()`, 8000)
    header = await evaluate(cdp, READ_HEADER)
    const pixel = await evaluate(cdp, `
      (() => {
        const img = document.querySelector("h1.text-xl").closest(".rounded-lg").querySelector("[data-slot=avatar] img")
        const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight
        const g = c.getContext("2d"); g.drawImage(img, 0, 0)
        return [...g.getImageData(2, 2, 1, 1).data].slice(0, 3)
      })()
    `)
    await shot(cdp, '4-detail-replaced')
    log('4. Kepala halaman detail menampilkan foto PENGGANTI', header.loaded && header.src !== headerSrcA && pixel[2] > pixel[0],
      `rgb(${pixel.join(',')})`)

    // --- 5. daftar pegawai ------------------------------------------------
    cdp.events.length = 0
    await goto(cdp, `${BASE}/hr/employees`, 10000)
    const list = await evaluate(cdp, `
      (() => [...document.querySelectorAll("tbody tr")].map((tr) => {
        const avatar = tr.querySelector("[data-slot=avatar]")
        if (!avatar) return null
        const img = avatar.querySelector("img")
        return {
          text: tr.innerText,
          width: Math.round(avatar.getBoundingClientRect().width),
          loaded: img ? img.naturalWidth > 0 : false,
          objectFit: img ? getComputedStyle(img).objectFit : null,
          initials: (avatar.querySelector("[data-slot=avatar-fallback]") || {}).innerText || null,
        }
      }))()
    `)
    const mine = list.find(r => r && r.text.includes(TARGET))
    if (mine) {
      log('5. Daftar: baris sasaran menampilkan foto 32px', mine.loaded && mine.width === 32 && mine.objectFit === 'cover', JSON.stringify(mine))
    }
    else {
      log('5. Daftar: baris sasaran di halaman pertama', false, 'tidak ditemukan — cari manual')
    }
    const withoutPhoto = list.filter(r => r && !r.loaded)
    log('5. Daftar: baris tanpa foto → inisial',
      withoutPhoto.length > 0 && withoutPhoto.every(r => Boolean(r.initials)),
      `${withoutPhoto.length} baris tanpa foto`)

    const listRequests = cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent')
      .map(e => e.params.request.url)
    const previewCalls = cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent'
        && e.params.request.url.includes('/preview/')
        && e.params.request.method !== 'OPTIONS')
      .map(e => e.params.request.url)
    console.log('   metode permintaan preview/:', cdp.events
      .filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/preview/'))
      .map(e => e.params.request.method).join(','))
    // Permintaan API lain yang menyebut avatar (mis. satu per baris
    // untuk menanyakan "punya foto atau tidak"). Harus nol.
    const avatarCalls = listRequests.filter(u => u.includes('/api/') && /avatar/.test(u))
    // Yang dijaga: satu **alamat** diunduh sekali, bukan sekali per
    // baris. Halaman bisa merender ulang (data refresh), jadi yang
    // dibandingkan alamat uniknya.
    const uniquePreview = new Set(previewCalls)
    const photoRows = list.filter(r => r && r.loaded).length
    log('5. Tanpa N+1: unduhan foto unik = jumlah pegawai berfoto',
      uniquePreview.size === photoRows && avatarCalls.length === 0,
      `${uniquePreview.size} alamat unik / ${previewCalls.length} permintaan, ${photoRows} baris berfoto, ${list.length} baris`)

    const broken = await evaluate(cdp, READ_BROKEN)
    log('5. Tidak ada gambar rusak', broken.length === 0, broken.join(' | '))

    await shot(cdp, '5-list')
  }
  finally {
    // --- pemulihan ---------------------------------------------------------
    const restore = await api(`/api/hr/employees/${target.id}/`, {
      method: 'PATCH', body: JSON.stringify({ avatar_file: original }),
    })
    let purged = 0
    for (const publicId of uploaded) {
      const res = await api(`/api/uploads/${publicId}/purge/`, { method: 'DELETE' })
      if (res.status < 300)
        purged += 1
    }
    // Draf uji yang tidak pernah tertaut (mis. Save yang gagal): hanya
    // nama berkas uji, dibuat sesudah run ini mulai, oleh akun ini.
    const listing = (await api('/api/uploads/?page_size=200')).body
    const drafts = (listing?.data ?? listing?.results ?? listing ?? [])
      .filter(f => /^photo-[ab]\.png$/.test(f.original_name ?? '')
        && f.created_at >= startedAt
        && f.uploaded_by === auth.user?.id
        && !uploaded.has(f.public_id))
    for (const f of drafts) {
      const res = await api(`/api/uploads/${f.public_id}/purge/`, { method: 'DELETE' })
      if (res.status < 300)
        purged += 1
    }
    console.log(`\nPemulihan: PATCH avatar_file=${original} → ${restore.status}; purge ${purged}/${uploaded.size + drafts.length} berkas uji`)

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
