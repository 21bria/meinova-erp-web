/*
 * UAT browser "Jadwal Saya" — My Workspace → Lihat Jadwal.
 *
 * Pola yang sama dengan `self-service.mjs`: Chrome headless lewat CDP,
 * tanpa Playwright, memakai paket `ws` yang sudah ada.
 *
 *     node scripts/uat/my-schedule.mjs
 *
 * Yang diperiksa:
 *   - tombol Lihat Jadwal di `/me` menuju `/hr/shift-calendar?mode=my`
 *   - supervisor + `?mode=my`: judul "My Schedule/Jadwal Saya", checkbox
 *     tercentang, tanpa penyaring pegawai, data dari `/api/me/schedule/`
 *     dan **tidak** dari `/api/hr/shift-calendar/`
 *   - supervisor mematikan checkbox: `mode` hilang dari URL, penyaring
 *     pegawai muncul, kalender HR dimuat seperti sebelumnya
 *   - supervisor dari menu HR: checkbox ada tapi tidak tercentang
 *   - pegawai biasa + `?mode=my`: tanpa checkbox, tanpa penyaring
 *   - pegawai biasa dari menu HR: perilaku lama (tanpa checkbox)
 *   - tanpa error konsol
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_TEAM_USER, UAT_EMP_USER,
 * UAT_PASS, UAT_OUT. Keluar dengan kode 1 kalau ada yang gagal.
 */
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import WebSocket from 'ws'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9343
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), 'meinova-uat-my-schedule')
// Supervisor site: EMPLOYEE + `reports_to`, jadi `selector_required`.
const TEAM_USER = process.env.UAT_TEAM_USER ?? 'demo.sitespv'
// Operator: hanya dirinya sendiri.
const EMP_USER = process.env.UAT_EMP_USER ?? 'demo.opr1'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function launch() {
  const profile = path.join(OUT, 'chrome-profile')

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
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  await fs.writeFile(path.join(OUT, `${name}.png`), Buffer.from(data, 'base64'))
}

async function goto(cdp, url, waitMs = 7000) {
  cdp.events.length = 0
  await cdp.send('Page.navigate', { url })
  await sleep(waitMs)
}

async function loginAs(cdp, username) {
  const auth = await (await fetch(`${API}/api/accounts/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: PASS }),
  })).json()

  if (!auth.access)
    throw new Error(`Login API gagal untuk ${username}: ${JSON.stringify(auth)}`)

  await goto(cdp, `${BASE}/`, 2500)

  for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]]) {
    await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })
  }
}

/** `GET` API yang diminta halaman sejak navigasi terakhir (tanpa preflight). */
function apiGets(cdp) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .filter(e => e.params.request.method === 'GET')
    .map(e => new URL(e.params.request.url))
    .filter(u => u.pathname.startsWith('/api/'))
    .map(u => `${u.pathname}${u.search}`)
}

function consoleErrors(cdp) {
  return cdp.events
    .filter(e => (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
      || e.method === 'Runtime.exceptionThrown')
    .map(e => e.params?.entry?.text ?? e.params?.exceptionDetails?.text)
}

const READ = `
  (() => {
    const box = document.querySelector('#shift-calendar-my-schedule')
    return {
      path: location.pathname,
      search: location.search,
      // h1 pertama milik header layout; judul halaman ada di konten.
      h1: [...document.querySelectorAll('h1')].at(-1)?.innerText.trim() ?? '',
      crumb: [...document.querySelectorAll('header a, header span, header li')].map(n => n.innerText.trim()).filter(Boolean).join(' > '),
      hasToggle: Boolean(box),
      toggleChecked: box ? box.getAttribute('data-state') === 'checked' : null,
      text: document.body.innerText,
      hasEmployeeSelector: document.body.innerText.includes('Pilih pegawai')
        || [...document.querySelectorAll('input,button')].some(n => (n.getAttribute('placeholder') || '').includes('Pilih pegawai')),
      hasAdjust: [...document.querySelectorAll('button')].some(b => b.innerText.trim() === 'Adjust Shift'),
    }
  })()
`

const MY_TITLES = ['My Schedule', 'Jadwal Saya']

let pass = 0
let fail = 0

function log(name, ok, detail = '') {
  ok ? pass++ : fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? `  — ${detail}` : ''}`)
}

async function main() {
  const chrome = await launch()
  const cdp = await attach()

  try {
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Log.enable')
    await cdp.send('Network.enable')

    // --- Supervisor ---------------------------------------------------
    await loginAs(cdp, TEAM_USER)

    await goto(cdp, `${BASE}/me`, 8000)
    const links = await evaluate(cdp, `[...document.querySelectorAll('a')].map(a => a.getAttribute('href') || '')`)
    log('1. /me → Lihat Jadwal menuju ?mode=my', links.includes('/hr/shift-calendar?mode=my'), links.filter(l => l.includes('shift')).join(', '))

    await goto(cdp, `${BASE}/hr/shift-calendar?mode=my`)
    let view = await evaluate(cdp, READ)
    let gets = apiGets(cdp)
    await shot(cdp, '1-supervisor-my')
    log('2. supervisor ?mode=my: judul Jadwal Saya', MY_TITLES.includes(view.h1), view.h1)
    log('2. breadcrumb tanpa query', !view.crumb.includes('?'), view.crumb)
    log('2. checkbox tampil & tercentang', view.hasToggle && view.toggleChecked === true)
    log('2. tanpa penyaring pegawai', !view.hasEmployeeSelector)
    log('2. identitas sendiri tampil', view.text.includes('SGA001 - Rinaldo Saputra'))
    log('2. data dari /api/me/schedule/', gets.some(u => u.startsWith('/api/me/schedule/')), gets.filter(u => u.includes('schedule') || u.includes('shift-calendar/?')).join(' | '))
    log('2. /api/hr/shift-calendar/?employee tidak dipanggil', !gets.some(u => u.startsWith('/api/hr/shift-calendar/?')))
    log('2. tombol Adjust Shift tidak ditawarkan', !view.hasAdjust)
    log('2. tanpa error konsol', consoleErrors(cdp).length === 0, consoleErrors(cdp).join(' | '))

    cdp.events.length = 0
    await evaluate(cdp, `document.querySelector('#shift-calendar-my-schedule').click()`)
    await sleep(5000)
    view = await evaluate(cdp, READ)
    gets = apiGets(cdp)
    await shot(cdp, '2-supervisor-toggle-off')
    log('3. checkbox OFF: mode hilang dari URL', !view.search.includes('mode=my'), view.search || '(kosong)')
    log('3. judul kembali Employee Shift Calendar', view.h1 === 'Employee Shift Calendar', view.h1)
    log('3. checkbox tetap ada, tidak tercentang', view.hasToggle && view.toggleChecked === false)
    // Pegawai terpilih mengikuti `default_employee` HR yang lama; untuk
    // supervisor yang cakupannya lebar itu boleh kosong. Yang diperiksa:
    // tidak ada lagi permintaan `/api/me/schedule/`, dan penyaring pegawai
    // tersedia.
    log('3. penyaring pegawai tersedia', view.hasEmployeeSelector || gets.some(u => u.startsWith('/api/hr/shift-calendar/?')))
    log('3. tidak memanggil /api/me/schedule/ lagi', !gets.some(u => u.startsWith('/api/me/schedule/')), gets.filter(u => u.includes('schedule') || u.includes('shift-calendar')).join(' | '))

    await goto(cdp, `${BASE}/hr/shift-calendar`)
    view = await evaluate(cdp, READ)
    gets = apiGets(cdp)
    log('4. supervisor dari menu HR: checkbox ada, OFF', view.hasToggle && view.toggleChecked === false)
    log('4. supervisor dari menu HR: tidak memanggil /api/me/schedule/', !gets.some(u => u.startsWith('/api/me/schedule/')))

    // --- Pegawai biasa ------------------------------------------------
    await loginAs(cdp, EMP_USER)

    await goto(cdp, `${BASE}/hr/shift-calendar?mode=my`)
    view = await evaluate(cdp, READ)
    gets = apiGets(cdp)
    await shot(cdp, '3-employee-my')
    log('5. pegawai ?mode=my: judul Jadwal Saya', MY_TITLES.includes(view.h1), view.h1)
    log('5. pegawai: tanpa checkbox (mode tetap)', !view.hasToggle)
    log('5. pegawai: tanpa penyaring pegawai', !view.hasEmployeeSelector)
    log('5. pegawai: identitas sendiri', view.text.includes('LOK002 - Jufri Sangaji'))
    log('5. pegawai: data dari /api/me/schedule/', gets.some(u => u.startsWith('/api/me/schedule/')))
    log('5. tanpa error konsol', consoleErrors(cdp).length === 0, consoleErrors(cdp).join(' | '))

    await goto(cdp, `${BASE}/hr/shift-calendar`)
    view = await evaluate(cdp, READ)
    gets = apiGets(cdp)
    await shot(cdp, '4-employee-hr-entry')
    log('6. pegawai dari menu HR: perilaku lama, tanpa checkbox', !view.hasToggle && view.h1 === 'Employee Shift Calendar', view.h1)
    log('6. pegawai dari menu HR: kalender HR employee=149', gets.some(u => u.startsWith('/api/hr/shift-calendar/?') && u.includes('employee=149')))
  }
  finally {
    cdp.close()
    chrome.kill()
  }

  console.log(`\n${pass} lulus, ${fail} gagal — tangkapan layar di ${OUT}`)
  process.exit(fail ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
