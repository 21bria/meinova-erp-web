/*
 * UAT browser — lampiran kandidat benar-benar tertaut.
 *
 * Membuktikan alur yang diperbaiki `keepsFileFieldValue()` pada modul
 * hasil generate: unggah lewat widget → id masuk model form →
 * `buildPayload()` → PATCH → relasi tersimpan → form dibuka ulang →
 * Pratinjau/Unduh bertoken.
 *
 * Datanya **buatan sendiri**: kandidat baru dibuat lewat API di awal dan
 * dihapus lagi di akhir, berikut berkas ujinya. Tidak ada record yang
 * sudah ada yang disentuh.
 *
 *     node scripts/uat/candidate-attachment.mjs
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_USER, UAT_PASS, UAT_OUT,
 * UAT_CANDIDATE (nomor kandidat uji).
 */
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import WebSocket from 'ws'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9338
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const OUT = process.env.UAT_OUT
  ?? path.join(os.tmpdir(), 'meinova-uat-candidate-attachment')
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}

const TARGET = process.env.UAT_CANDIDATE ?? 'UAT-ATTACH'

// Satu berkas uji (PNG kecil) untuk lampiran kandidat.
const DOC_A = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAFACAIAAAANimYEAAAFlElEQVR4nO3awU1cWRBAUTyaYH4QBOMgHIaDcDgO4Yczi5FGyG0YwA3ddeuctRfv1bsqvsBffj4+PkDFX7c+AFyToEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkRNCl/3/oAQceP76//x+fXbx95lnW+/Hx8vPUZdhX8Mn3/IUHfRceXlP0+gr6vji8p+00EfacdX1L2awh6QMpPyfplgh6T8lOyfo6gh6X8lKwv+cPK1JoHnfMz2dCFRKzq/9jQ42seffKrE3SkiennvxafHLUUzt3/OWT7ho7V/FC80ZusDrr69kf0Xq+xN+j2qx/p271gadAb3vtYcMdLG4Pe89LHmpvuDXrbGx/L7rsr6G2vu/DWi4Je9a5r774l6D0vunwCK4Je8pb/a8McVgTNHv2gN6yl1zvq04gHnX+/dzjSMykH3X65P3F0J1MOmoWyQYeX0FUc0fk0g66+1nUdxSk1g2atYNDJxfNBjtysgkGzWS3o3sr5aEdrYrWgWS4VdGzZfJojNLdU0NAJurRmPt9RmV4naOgEnVkwN3QkZhgJGjpBN1bLPTjmT7IQNPxH0KSMDzrwU/KuHMPnOT5oeErQpMwOevrPx/t0TJ7q7KDhF4ImRdCkDA569KfenTvGznZw0HBJ0KQImpSpQc/9yJvimDnhqUHDbwmaFEGTImhSBE2KoEkZGfTQ3yiNcwyc88ig4TmCJkXQpAiaFEGTImhSBE2KoEkRNCmCJkXQpAiaFEGTImhSBE2KoEkZGfT59dutj7DCOXDOI4OG5wiaFEGTImhSBE2KoEmZGvTE3yjNcs6c8NSg4bcETYqgSRkc9NCPvBHOsbMdHDRcEjQpgiZldtBzP/Xu2Tl5qrODhl8ImpTxQY/++XiHzuHzHB80PCVoUgpBT/8peT/O+ZMsBA21oAOr5ebOxAwjQUMt6MaCuZWzMr1O0FALOrNmPtkZmlsqaKgFXVo2n+NsTawWNMsFg46tnA915mYVDJrNmkH3Fs9HOItTagZdfa0rOqPzyQbNTuWgq0voz53dyZSDbr/cu53pmcSDzr/fW531afSDZpUVQefX0iudC+awIuglb/myJRPYEvSeF11+90VBr3rXtbfeFfS2133Yd991Qa9643PNTVcHveSlzwV3vLQ06Px7n+nbvWBv0OFXP6P3eo3VQSff/szd6E2+/Hx8vPUZ7sLx4/vDcOfulP+1fUNnaph+/msRdKGJuSe/Op8csz8/pPwLG3pwJVPO+Zls6JGrWsrPEfSwrKX8MkGPyVrKryHoey9bx28i6DstW8fvI+j7KlvHf0jQN+5bwdclaFL8YYUUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0KYImRdCkCJoUQZMiaFIETYqgSRE0DyX/AE37An42Qa7KAAAAAElFTkSuQmCC'
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

const FIELD = 'resume_file'
const ROW = `[data-field-key=${FIELD}] .rounded-lg.border.p-3`

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

async function clickTitle(cdp, title) {
  const box = await evaluate(cdp, `
    (() => {
      const b = document.querySelector('[data-field-key=${FIELD}] button[title="${title}"]')
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

async function openProfileTab(cdp) {
  // Hanya `[role=tab]` milik editor: "Profile" juga ada di sidebar dan
  // di menu avatar, dan `.click()` pada keduanya tidak memindahkan tab
  // mana pun — gejalanya tab tetap General dan fieldnya "tidak ada".
  const box = await evaluate(cdp, `
    (() => {
      const tab = [...document.querySelectorAll("[role=tab]")]
        .find(n => n.innerText.trim().toLowerCase() === "profile")
      if (!tab) return null
      tab.scrollIntoView({ block: "center" })
      const r = tab.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })()
  `)

  if (!box)
    return false

  for (const type of ['mousePressed', 'mouseReleased'])
    await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 })

  return waitFor(cdp, `Boolean(document.querySelector("[data-field-key=${FIELD}]"))`, 8000)
}

async function chooseFile(cdp, file) {
  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true })
  const { nodeId } = await cdp.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: `[data-field-key=${FIELD}] input[type=file]`,
  })
  if (!nodeId)
    return false
  await cdp.send('DOM.setFileInputFiles', { nodeId, files: [file] })
  return true
}

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  const docA = path.join(OUT, 'resume-uat.png')
  await fs.writeFile(docA, Buffer.from(DOC_A, 'base64'))

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

  const unwrap = r => r.body?.data ?? r.body

  // Kandidat uji milik run ini sendiri.
  const created = await api('/api/hr/candidates/', {
    method: 'POST',
    body: JSON.stringify({
      candidate_number: TARGET,
      full_name: 'UAT Attachment Probe',
      applied_date: new Date().toISOString().slice(0, 10),
    }),
  })

  const candidate = unwrap(created)

  if (!candidate?.id)
    throw new Error(`Gagal membuat kandidat uji: ${created.status} ${JSON.stringify(created.body)}`)

  log('0. Kandidat uji dibuat lewat API', true, `id=${candidate.id} ${TARGET}`)

  let attachedPublicId = null

  const chrome = await launch()
  const cdp = await attach()

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  await cdp.send('Network.enable')
  await cdp.send('DOM.enable')
  await cdp.send('Target.setDiscoverTargets', { discover: true })

  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false,
    })

    await goto(cdp, `${BASE}/`, 3000)
    for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]])
      await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })

    const editUrl = `${BASE}/hr/candidates/${candidate.id}/edit`

    // --- 1. unggah lampiran lewat form sungguhan ------------------------
    await goto(cdp, editUrl, 9000)
    log('1. Tab Profile terbuka', await openProfileTab(cdp))
    await sleep(1500)
    const picked = await chooseFile(cdp, docA)
    if (!picked) {
      console.log('   field keys terlihat:', await evaluate(cdp, `
        [...document.querySelectorAll("[data-field-key]")].map(n => n.getAttribute("data-field-key")).join(",")
      `))
      console.log('   tab aktif:', await evaluate(cdp, `
        [...document.querySelectorAll("button,[role=tab]")].filter(n => n.getAttribute("data-state") === "active" || n.getAttribute("aria-selected") === "true").map(n => n.innerText.trim()).join("|")
      `))
    }
    log('1. Input berkas lampiran ada', picked)

    const uploadedOk = await waitFor(cdp, `
      (() => {
        const f = document.querySelector("[data-field-key=${FIELD}]")
        return !!(f && !/Uploading/.test(f.innerText) && f.innerText.includes("resume-uat.png"))
      })()
    `)
    log('1. Baris berkas tampil sesudah unggah', uploadedOk)

    // Gambar yang BARU diunggah (belum disimpan) juga bisa dibuka besar.
    const freshThumb = await evaluate(cdp, `
      (() => {
        const t = document.querySelector("[data-field-key=resume_file] .rounded-lg.border.p-3 > div:first-child")
        if (!t) return null
        t.scrollIntoView({ block: "center" })
        const r = t.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      })()
    `)
    if (freshThumb) {
      for (const type of ['mousePressed', 'mouseReleased'])
        await cdp.send('Input.dispatchMouseEvent', { type, x: freshThumb.x, y: freshThumb.y, button: 'left', clickCount: 1 })
    }
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(700)
    const freshDialog = await evaluate(cdp, `
      (() => {
        const dlg = document.querySelector("[data-slot=dialog-content]")
        const img = dlg && dlg.querySelector("img")
        return { open: Boolean(dlg), loaded: img ? img.naturalWidth > 0 : false, src: img ? img.getAttribute("src") : null }
      })()
    `)
    log('1b. Gambar yang baru diunggah (belum disimpan) bisa dibuka besar',
      freshDialog.open && freshDialog.loaded && String(freshDialog.src).startsWith('blob:'))

    // Tombol X menutup (bukan Escape).
    const closed = await evaluate(cdp, `
      (() => {
        const dlg = document.querySelector("[data-slot=dialog-content]")
        const btn = dlg && [...dlg.querySelectorAll("button")].find(b => b.querySelector(".sr-only")?.innerText.trim() === "Close" || b.textContent.trim() === "Close")
        if (!btn) return false
        btn.click()
        return true
      })()
    `)
    await sleep(800)
    log('1b. Tombol X menutup dialog',
      closed && !(await evaluate(cdp, `Boolean(document.querySelector("[data-slot=dialog-content]"))`)))

    // --- 2. Save → relasi benar-benar tersimpan --------------------------
    log('2. Tombol Save diklik', await clickButton(cdp, 'Save'))
    await sleep(4000)

    let fresh = unwrap(await api(`/api/hr/candidates/${candidate.id}/`))
    attachedPublicId = fresh?.resume_file_detail?.public_id ?? null

    log('2. resume_file tersimpan (id ikut PATCH)', Boolean(fresh?.resume_file),
      `resume_file=${fresh?.resume_file} nama=${fresh?.resume_file_detail?.original_name}`)
    log('2. Berkasnya memang berkas uji run ini',
      fresh?.resume_file_detail?.original_name === 'resume-uat.png')

    // --- 3. buka ulang: lampiran tetap ada --------------------------------
    cdp.events.length = 0
    await goto(cdp, editUrl, 9000)
    await openProfileTab(cdp)
    await sleep(1500)

    const reopened = await evaluate(cdp, `
      (() => {
        const f = document.querySelector("[data-field-key=${FIELD}]")
        const img = document.querySelector("${ROW} img")
        return {
          found: Boolean(f),
          text: f ? f.innerText.split("\\n").join(" | ") : "",
          hasImage: Boolean(img),
          loaded: img ? img.complete && img.naturalWidth > 0 : false,
          src: img ? img.getAttribute("src") : null,
        }
      })()
    `)
    await shot(cdp, '3-candidate-reopened')
    log('3. Form dibuka ulang masih memegang lampirannya',
      reopened.found && reopened.text.includes('resume-uat.png'), reopened.text.slice(0, 90))
    log('3. Pratinjau lewat blob: (diambil bertoken)',
      !reopened.hasImage || (reopened.loaded && String(reopened.src).startsWith('blob:')),
      `img=${reopened.hasImage} loaded=${reopened.loaded}`)

    // --- 4. Pratinjau / Unduh bertoken ------------------------------------
    const downloads = path.join(OUT, 'downloads')
    await fs.rm(downloads, { recursive: true, force: true })
    await fs.mkdir(downloads, { recursive: true })
    await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads })

    cdp.events.length = 0
    log('4. Tombol Preview ada', await clickTitle(cdp, 'Preview'))
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    const fromButton = await evaluate(cdp, `
      (() => {
        const dlg = document.querySelector("[data-slot=dialog-content]")
        const img = dlg && dlg.querySelector("img")
        return { open: Boolean(dlg), loaded: img ? img.naturalWidth > 0 : false }
      })()
    `)
    const pages = (await cdp.send('Target.getTargets')).targetInfos.filter(t => t.type === 'page')
    log('4. Preview membuka lightbox di aplikasi, bukan tab baru',
      fromButton.open && fromButton.loaded && pages.length === 1,
      `tab=${pages.length} gambar=${fromButton.loaded}`)
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await sleep(800)

    cdp.events.length = 0
    log('4. Tombol Download ada', await clickTitle(cdp, 'Download'))
    let saved = []
    for (let i = 0; i < 20 && !saved.some(f => f.endsWith('.png')); i++) {
      await sleep(500)
      saved = await fs.readdir(downloads)
    }
    const downloadStatus = cdp.events
      .filter(e => e.method === 'Network.responseReceived' && e.params.response.url.includes('/download/'))
      .map(e => e.params.response.status)
    const file = saved.find(f => f.endsWith('.png'))
    const magic = file ? (await fs.readFile(path.join(downloads, file))).subarray(0, 4).toString('hex') : ''
    log('4. Download menyimpan berkas aslinya',
      file === 'resume-uat.png' && magic === '89504e47' && downloadStatus.every(s => s === 200),
      `berkas=${saved.join(',') || '(tidak ada)'} magic=${magic} status=${downloadStatus.join(',')}`)


    // --- 4b. lightbox: klik thumbnail → dialog di dalam aplikasi --------
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
          const t = document.querySelector("[data-field-key=resume_file] .rounded-lg.border.p-3 > div:first-child")
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
    log('4b. Thumbnail bisa diklik', await clickThumb())
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)
    const lightbox = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '4b-lightbox')

    log('4b. Dialog terbuka di halaman yang sama (tanpa tab baru)',
      lightbox.open && (await cdp.send('Target.getTargets')).targetInfos.filter(t => t.type === 'page').length === 1,
      `lebar=${lightbox.width}px`)
    log('4b. Gambarnya tampil, utuh (object-contain)',
      lightbox.loaded && lightbox.objectFit === 'contain',
      `loaded=${lightbox.loaded} fit=${lightbox.objectFit} tinggi=${lightbox.imgHeight}px`)
    log('4b. Memakai blob yang sudah ada — tanpa unduhan kedua',
      String(lightbox.src).startsWith('blob:')
      && cdp.events.filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/preview/')).length === 0,
      `src=${String(lightbox.src).slice(0, 12)}`)
    log('4b. Nama berkas tercetak di kepala dialog', lightbox.title.includes('resume-uat.png'), lightbox.title)
    log('4b. Tombol Download ada di dialog', lightbox.hasDownload)

    // Unduh dari dalam dialog: jalur bertoken yang sama.
    await fs.rm(path.join(OUT, 'downloads'), { recursive: true, force: true })
    await fs.mkdir(path.join(OUT, 'downloads'), { recursive: true })
    await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.join(OUT, 'downloads') })
    cdp.events.length = 0
    await evaluate(cdp, `
      (() => {
        const dlg = document.querySelector("[data-slot=dialog-content]")
        const btn = dlg && [...dlg.querySelectorAll("button")].find(b => b.innerText.trim() === "Download")
        if (btn) btn.click()
        return Boolean(btn)
      })()
    `)
    let fromDialog = []
    for (let i = 0; i < 20 && !fromDialog.some(f => f.endsWith('.png')); i++) {
      await sleep(500)
      fromDialog = await fs.readdir(path.join(OUT, 'downloads'))
    }
    const dialogDownloadStatus = cdp.events
      .filter(e => e.method === 'Network.responseReceived' && e.params.response.url.includes('/download/'))
      .map(e => e.params.response.status)
    log('4b. Download dari dalam dialog memakai jalur bertoken',
      fromDialog.includes('resume-uat.png') && dialogDownloadStatus.every(st => st === 200),
      `berkas=${fromDialog.join(',') || '(tidak ada)'} status=${dialogDownloadStatus.join(',')}`)

    // Escape menutup
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await sleep(800)
    log('4b. Escape menutup dialog', !(await evaluate(cdp, READ_DIALOG)).open)

    // Ponsel: dialog tetap muat, tanpa scroll horizontal
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
    await sleep(600)
    await clickThumb()
    await waitFor(cdp, `Boolean(document.querySelector("[data-slot=dialog-content] img"))`, 8000)
    await sleep(900)
    const mobileBox = await evaluate(cdp, READ_DIALOG)
    await shot(cdp, '4b-lightbox-mobile')
    log('4b. Ponsel 390px: dialog muat, tanpa scroll horizontal',
      mobileBox.open && mobileBox.width <= 390 && !mobileBox.overflow && mobileBox.loaded,
      `lebar=${mobileBox.width}px overflow=${mobileBox.overflow}`)
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false })
    await sleep(600)
    // --- 5. melepas lampiran juga sampai ke backend -----------------------
    const detached = await api(`/api/hr/candidates/${candidate.id}/`, {
      method: 'PATCH', body: JSON.stringify({ resume_file: null }),
    })
    log('5. Lampiran bisa dilepas lewat PATCH null',
      detached.status === 200 && !unwrap(detached)?.resume_file)
  }
  finally {
    // --- pembersihan: hapus kandidat uji + berkasnya ----------------------
    const removed = await api(`/api/hr/candidates/${candidate.id}/`, { method: 'DELETE' })
    let purged = 'n/a'
    if (attachedPublicId) {
      const res = await api(`/api/uploads/${attachedPublicId}/purge/`, { method: 'DELETE' })
      purged = res.status
    }
    console.log(`\nPembersihan: DELETE kandidat ${candidate.id} → ${removed.status}; purge berkas uji → ${purged}`)

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
