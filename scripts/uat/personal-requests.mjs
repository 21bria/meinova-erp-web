/*
 * UAT browser pengajuan pribadi — My Workspace → Ajukan Cuti / Ajukan Izin.
 *
 * Pola yang sama dengan `self-service.mjs`: Chrome headless lewat CDP,
 * tanpa Playwright, memakai paket `ws` yang sudah ada.
 *
 *     node scripts/uat/my-schedule.mjs
 *
 * Yang diperiksa (Farah = `demo.homanager`, atasan dengan tim):
 *   - tombol di `/me` menuju `...create?mode=my`
 *   - formulir pribadi: identitas Farah sebagai teks, tanpa dropdown
 *     pegawai, tanpa lookup `/api/hr/employees/lookup/`, tanpa tab HR
 *     (HR Override / Organization / Review & Attendance)
 *   - Kirim dengan formulir kosong: POST ke `/api/me/*` **tanpa**
 *     `employee` di body, ditolak validasi (tidak ada baris tertulis)
 *   - HR → Create (akun HR): formulir organisasi tetap lengkap
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_MANAGER_USER, UAT_HR_USER,
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
const PORT = 9344
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), 'meinova-uat-personal-requests')
// Farah Anindita (HO005): EMPLOYEE + FINANCE-MANAGER, punya bawahan.
const MANAGER_USER = process.env.UAT_MANAGER_USER ?? 'demo.homanager'
const HR_USER = process.env.UAT_HR_USER ?? 'demo.hradmin'
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

function posts(cdp, needle) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .filter(e => e.params.request.method === 'POST' && e.params.request.url.includes(needle))
    .map(e => ({ id: e.params.requestId, body: e.params.request.postData ?? '' }))
}

function statusOf(cdp, requestId) {
  return cdp.events.find(e => e.method === 'Network.responseReceived' && e.params.requestId === requestId)?.params.response.status
}

// Kesalahan konsol selain "Failed to load resource" (400 yang memang diuji).
function realConsoleErrors(cdp) {
  return consoleErrors(cdp).filter(text => !String(text).includes('Failed to load resource'))
}

const READ = `
  (() => ({
    h1: [...document.querySelectorAll('h1')].at(-1)?.innerText.trim() ?? '',
    text: document.body.innerText,
    hasSubject: Boolean(document.querySelector('[data-personal-subject]')),
    subject: document.querySelector('[data-personal-subject]')?.innerText.replace(/\\s+/g, ' ').trim() ?? '',
    labels: [...document.querySelectorAll('label')].map(l => l.innerText.trim()).filter(Boolean),
    tabs: [...document.querySelectorAll('[role=tab]')].map(t => t.innerText.trim()),
  }))()
`

const TEAM_NAMES = ['Adrian Mahendra', 'Ahmad Sudrajat', 'Bayu Nugraha', 'Bayu Prakoso']
const HR_TABS = ['HR Override', 'Organization', 'Review & Attendance']

let pass = 0
let fail = 0

function log(name, ok, detail = '') {
  ok ? pass++ : fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? `  — ${detail}` : ''}`)
}

async function waitFor(cdp, selector, timeoutMs = 20000) {
  for (let waited = 0; waited < timeoutMs; waited += 500) {
    if (await evaluate(cdp, `Boolean(document.querySelector(${JSON.stringify(selector)}))`))
      return true
    await sleep(500)
  }

  return false
}

async function personal(cdp, { label, route, endpoint, fieldLabel }) {
  await goto(cdp, `${BASE}${route}`, 2000)
  log(`${label}: formulir pribadi termuat`, await waitFor(cdp, '[data-personal-submit]'))
  await sleep(1500)
  const view = await evaluate(cdp, READ)
  const gets = apiGets(cdp)
  await shot(cdp, `${label}-personal`)

  log(`${label}: identitas Farah tampil sebagai teks`, view.hasSubject && view.subject.includes('HO005') && view.subject.includes('Farah Anindita'), view.subject)
  log(`${label}: tidak ada nama anggota tim di layar`, !TEAM_NAMES.some(n => view.text.includes(n)))
  log(`${label}: tidak memanggil lookup pegawai`, !gets.some(u => u.startsWith('/api/hr/employees/lookup')), gets.filter(u => u.includes('employee')).join(' | '))
  log(`${label}: tanpa tab/field HR`, !HR_TABS.some(t => view.tabs.includes(t)) && !view.text.includes('HR Override') && !view.text.includes('Allow Outside Shift'))
  log(`${label}: field pengajuan tersedia`, fieldLabel.some(f => view.labels.some(l => l.includes(f))), view.labels.join(', '))
  log(`${label}: tanpa error konsol`, realConsoleErrors(cdp).length === 0, realConsoleErrors(cdp).join(' | '))

  await evaluate(cdp, `document.querySelector('[data-personal-submit]').click()`)
  await sleep(3000)

  const sent = posts(cdp, endpoint)
  const body = sent[0]?.body ?? ''
  log(`${label}: Kirim → POST ${endpoint}`, sent.length === 1, `${sent.length} permintaan`)
  log(`${label}: body tanpa employee/user`, sent.length === 1 && !/"(?:employee|employee_id|user|user_id|subject)"/.test(body), body || '(kosong)')
  log(`${label}: formulir kosong ditolak backend (400), tetap di halaman`, sent.length === 1 && statusOf(cdp, sent[0].id) === 400 && (await evaluate(cdp, 'location.pathname')) === route.split('?')[0])
  await shot(cdp, `${label}-personal-validation`)
}

async function hrEntry(cdp, { label, route }) {
  await goto(cdp, `${BASE}${route}`)
  const view = await evaluate(cdp, READ)
  await shot(cdp, `${label}-hr`)

  log(`${label} HR create: formulir organisasi (Employee) tetap ada`, view.labels.some(l => /^Employee\b|^Karyawan|^Pegawai/.test(l)) && !view.hasSubject, view.labels.slice(0, 6).join(', '))
  return view
}

async function main() {
  const chrome = await launch()
  const cdp = await attach()

  try {
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Log.enable')
    await cdp.send('Network.enable')

    await loginAs(cdp, MANAGER_USER)

    await goto(cdp, `${BASE}/me`, 8000)
    const links = await evaluate(cdp, `[...document.querySelectorAll('a')].map(a => a.getAttribute('href') || '')`)
    log('1. /me → Ajukan Cuti menuju ?mode=my', links.includes('/hr/leave/create?mode=my'))
    log('1. /me → Ajukan Izin menuju ?mode=my', links.includes('/hr/attendance-permissions/create?mode=my'))

    await personal(cdp, {
      label: '2-izin',
      route: '/hr/attendance-permissions/create?mode=my',
      endpoint: '/api/me/attendance-permissions/',
      fieldLabel: ['Permission Type', 'Jenis Izin'],
    })

    await personal(cdp, {
      label: '3-cuti',
      route: '/hr/leave/create?mode=my',
      endpoint: '/api/me/leave-requests/',
      fieldLabel: ['Leave Type', 'Jenis Cuti'],
    })

    await loginAs(cdp, HR_USER)

    const permHr = await hrEntry(cdp, { label: '4-izin', route: '/hr/attendance-permissions/create' })
    log('4-izin HR create: tab HR Override tetap ada', permHr.tabs.some(t => t.includes('Override')) || permHr.text.includes('HR Override'), permHr.tabs.join(', '))
    await hrEntry(cdp, { label: '5-cuti', route: '/hr/leave/create' })
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
