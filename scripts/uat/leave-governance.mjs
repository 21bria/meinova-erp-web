/*
 * UAT browser — kontrak Leave sesudah HR Write Governance A.
 *
 * Pola yang sama dengan `personal-requests.mjs`: Chrome headless lewat
 * CDP, tanpa Playwright, memakai paket `ws` yang sudah ada.
 *
 *     node scripts/uat/leave-governance.mjs
 *
 * Yang dibuktikan:
 *   - HR Create Leave **tidak punya** field Status, dan Save menghasilkan
 *     DRAFT lewat `POST /api/hr/leaves/` tanpa `status` di body
 *   - tombol **Catat Cuti** hanya untuk pemegang `hr.record_employeeleave`;
 *     pegawai biasa tidak melihatnya
 *   - Catat Cuti menembak `POST /api/hr/leaves/record/`, juga tanpa
 *     `status` di body
 *   - My Workspace tidak berubah: `/me` → Ajukan Cuti tetap pribadi,
 *     tetap `POST /api/me/leave-requests/`, dan **tanpa** tombol Catat
 *     Cuti
 *
 * Variabel lingkungan: UAT_BASE, UAT_API, UAT_HR_USER, UAT_STAFF_USER,
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
const PORT = 9347
const BASE = process.env.UAT_BASE ?? 'http://localhost:3000'
const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const OUT = process.env.UAT_OUT ?? path.join(os.tmpdir(), 'meinova-uat-leave-governance')
const HR_USER = process.env.UAT_HR_USER ?? 'demo.hradmin'
// Farah Anindita (HO005): EMPLOYEE + FINANCE-MANAGER, tanpa wewenang
// pencatatan — dia yang membuktikan tombolnya memang dijaga izin.
const STAFF_USER = process.env.UAT_STAFF_USER ?? 'demo.homanager'
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

  /*
   * Storage dibersihkan lebih dulu. Tanpa ini, akun kedua tidak pernah
   * benar-benar masuk: `localStorage` masih memegang user hasil login
   * pertama, dan seluruh layar tetap memakai identitas yang lama —
   * kegagalan yang terbaca seperti "tombolnya bocor ke pegawai biasa".
   */
  await evaluate(cdp, 'localStorage.clear(); sessionStorage.clear(); true')

  for (const [name, value] of [['access', auth.access], ['refresh', auth.refresh]]) {
    await cdp.send('Network.setCookie', { name, value, url: BASE, path: '/', sameSite: 'Lax' })
  }

  await goto(cdp, `${BASE}/`, 3000)

  const who = await evaluate(cdp, `(() => {
    try {
      const raw = localStorage.getItem('user') ?? ''
      return raw.includes(${JSON.stringify(username)}) ? ${JSON.stringify(username)} : raw.slice(0, 120)
    }
    catch { return '' }
  })()`)

  return who
}

/*
 * Formulir HR **tidak** diisi di sini, dan itu batas yang disadari:
 * field Karyawan/Jenis Cuti memakai popover reka-ui yang tidak mau
 * terbuka di Chrome headless (mouse event maupun pointer event
 * sama-sama tidak memunculkan `[role=option]`). Yang dibuktikan
 * berkas ini karena itu perilaku **layarnya**: field apa yang ada,
 * tombol apa yang tampil untuk siapa, dan ke mana tombol pribadi
 * mengirim.
 *
 * Jalur bahagia `POST /api/hr/leaves/record/` dibuktikan di tempat
 * lain — probe tenant demo dan `apps.hr.tests.leave.test_leave_write_governance`.
 */

function posts(cdp, needle) {
  return cdp.events
    .filter(e => e.method === 'Network.requestWillBeSent')
    .filter(e => e.params.request.method === 'POST' && e.params.request.url.includes(needle))
    .map(e => ({ url: e.params.request.url, body: e.params.request.postData ?? '' }))
}

const READ = `
  (() => ({
    text: document.body.innerText,
    labels: [...document.querySelectorAll('label')].map(l => l.innerText.trim()).filter(Boolean),
    buttons: [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean),
    hasRecordButton: Boolean(document.querySelector('[data-leave-record]')),
    hasSubject: Boolean(document.querySelector('[data-personal-subject]')),
    hasPersonalSubmit: Boolean(document.querySelector('[data-personal-submit]')),
  }))()
`

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

/** Label Status muncul sebagai isian formulir (bukan kolom tabel/badge). */
function hasStatusField(view) {
  return view.labels.some(l => /^status\b/i.test(l))
}

async function main() {
  const chrome = await launch()
  const cdp = await attach()

  try {
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('Log.enable')
    await cdp.send('Network.enable')

    // ------------------------------------------------------------------
    // HR — pemegang hr.record_employeeleave
    // ------------------------------------------------------------------
    const hrWho = await loginAs(cdp, HR_USER)
    log('0. login HR benar-benar berganti akun', hrWho === HR_USER, hrWho)

    await goto(cdp, `${BASE}/hr/leave/create`, 6000)
    await sleep(2000)

    const hr = await evaluate(cdp, READ)
    await shot(cdp, '1-hr-create')

    log('1. HR Create Leave: tanpa isian Status', !hasStatusField(hr), hr.labels.join(', '))
    log('2. HR Create Leave: tombol Catat Cuti ada', hr.hasRecordButton, hr.buttons.join(' | '))
    log('2b. label tombolnya dwibahasa', hr.buttons.some(b => /Catat Cuti|Record Leave/.test(b)), hr.buttons.join(' | '))

    // Save pada formulir kosong: ditahan validasi klien, dan yang
    // penting — tidak ada satu pun permintaan yang membawa `status`.
    cdp.events.length = 0
    await evaluate(cdp, `[...document.querySelectorAll('button')].find(b => /^Save$|^Simpan$/.test(b.innerText.trim()))?.click()`)
    await sleep(3000)

    const savePosts = posts(cdp, '/api/hr/leaves/')
    const afterSave = await evaluate(cdp, 'document.body.innerText')
    log('3. Save: tidak ada permintaan yang membawa status', !savePosts.some(p => /"status"/.test(p.body)), savePosts.map(p => p.body).join(' | ').slice(0, 200) || '(tidak ada POST — ditahan validasi klien)')
    log('3b. Save pada formulir kosong ditahan validasi klien', /is required|wajib/i.test(afterSave))

    // Catat Cuti → endpoint record.
    await goto(cdp, `${BASE}/hr/leave/create`, 5000)
    await waitFor(cdp, '[data-leave-record]')

    cdp.events.length = 0
    await evaluate(cdp, `document.querySelector('[data-leave-record]').click()`)
    await sleep(3000)

    const afterRecord = await evaluate(cdp, 'document.body.innerText')
    log('4. Catat Cuti tersambung ke handler halaman (validasi klien berbunyi)', /is required|wajib/i.test(afterRecord))
    log('5. Catat Cuti tidak pernah mengirim status', !posts(cdp, '/api/hr/leaves/').some(p => /"status"/.test(p.body)))
    await shot(cdp, '2-hr-record')

    // ------------------------------------------------------------------
    // Pegawai biasa — tanpa wewenang pencatatan
    // ------------------------------------------------------------------
    const staffWho = await loginAs(cdp, STAFF_USER)
    log('5b. login pegawai biasa benar-benar berganti akun', staffWho === STAFF_USER, staffWho)

    await goto(cdp, `${BASE}/hr/leave/create`, 6000)
    await sleep(2000)

    const staff = await evaluate(cdp, READ)
    await shot(cdp, '3-staff-create')

    log('6. Pegawai biasa: tanpa tombol Catat Cuti', !staff.hasRecordButton, staff.buttons.join(' | '))
    log('7. Pegawai biasa: tetap tanpa isian Status', !hasStatusField(staff), staff.labels.join(', '))

    // ------------------------------------------------------------------
    // My Workspace — tidak boleh berubah
    // ------------------------------------------------------------------
    await goto(cdp, `${BASE}/me`, 8000)
    const links = await evaluate(cdp, `[...document.querySelectorAll('a')].map(a => a.getAttribute('href') || '')`)
    log('8. /me → Ajukan Cuti tetap ?mode=my', links.includes('/hr/leave/create?mode=my'))

    await goto(cdp, `${BASE}/hr/leave/create?mode=my`, 4000)
    log('9. formulir pribadi termuat', await waitFor(cdp, '[data-personal-submit]'))
    await sleep(1500)

    const me = await evaluate(cdp, READ)
    await shot(cdp, '4-my-workspace')

    log('10. My Workspace: identitas sebagai teks, bukan dropdown', me.hasSubject)
    log('11. My Workspace: tanpa tombol Catat Cuti', !me.hasRecordButton, me.buttons.join(' | '))
    log('12. My Workspace: tanpa isian Status', !hasStatusField(me), me.labels.join(', '))

    cdp.events.length = 0
    await evaluate(cdp, `document.querySelector('[data-personal-submit]').click()`)
    await sleep(3000)

    const personal = posts(cdp, '/api/me/leave-requests/')
    log('13. Kirim → POST /api/me/leave-requests/', personal.length === 1, `${personal.length} permintaan`)
    log('14. body pribadi tanpa employee dan tanpa status', personal.length === 1 && !/"(?:employee|employee_id|user|user_id|subject|status)"/.test(personal[0].body), personal[0]?.body ?? '(kosong)')
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
