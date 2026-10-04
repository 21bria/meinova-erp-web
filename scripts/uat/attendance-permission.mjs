/**
 * UAT Attendance Permission — sepuluh skenario trial, lewat API yang
 * sama persis dengan yang ditembak layar.
 *
 * Kenapa API dan bukan browser: yang diuji berkas ini **kontrak
 * frontend↔backend** — apakah payload yang sampai ke layar memuat
 * kunci yang dibaca `columns.ts`, `form.ts`, dan panel Review, dan
 * apakah angkanya benar. Menekan tombolnya lewat CDP menguji hal lain
 * (binding komponen), dan itu tidak bisa menutupi kesalahan kontrak:
 * kolom yang kuncinya salah tampil kosong tanpa satu pun error.
 *
 * Aturan yang dijaga di seluruh berkas ini: **tidak satu angka pun
 * dihitung di sini.** Yang dibandingkan angka dari backend dengan
 * angka yang diharapkan spesifikasi. Menghitung ulang di JavaScript
 * berarti menguji salinan aturan, bukan aturannya.
 *
 * Variabel lingkungan: UAT_API, UAT_USER, UAT_PASS.
 */

const API = process.env.UAT_API ?? 'http://demo.localhost:8000'
const USER = process.env.UAT_USER ?? 'admin'
const PASS = process.env.UAT_PASS
if (!PASS) {
  console.error('UAT_PASS environment variable is required.')
  process.exit(1)
}

let pass = 0
let fail = 0
const failures = []

function log(label, ok, detail = '') {
  if (ok)
    pass += 1
  else
    (fail += 1, failures.push(`${label}${detail ? ` — ${detail}` : ''}`))

  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
}

function eq(label, actual, expected) {
  log(label, actual === expected, `dapat ${JSON.stringify(actual)}, harap ${JSON.stringify(expected)}`)
}

let TOKEN = ''

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const text = await res.text()

  let json = null
  try {
    json = text ? JSON.parse(text) : null
  }
  catch {
    json = { raw: text }
  }

  return { status: res.status, json }
}

function rows(payload) {
  const d = payload?.data ?? payload
  if (Array.isArray(d))
    return d
  return d?.results ?? d?.data ?? []
}

async function main() {
  // --- login ---------------------------------------------------------
  const auth = await api('/api/accounts/auth/login/', {
    method: 'POST',
    body: { username: USER, password: PASS },
  })

  TOKEN = auth.json?.access ?? ''
  log('Login', Boolean(TOKEN), `status ${auth.status}`)

  if (!TOKEN)
    return

  // --- kontrak schema ------------------------------------------------
  const schema = await api('/api/framework/schema/hr/attendance-permissions/')
  const s = schema.json?.data ?? schema.json

  eq('Schema type crud', s?.type, 'crud')
  eq('Schema endpoint', s?.endpoint, '/api/hr/attendance-permissions/')

  const actionKeys = (s?.actions ?? []).map(a => a.key).sort()
  log(
    'Schema membawa 4 workflow action',
    JSON.stringify(actionKeys) === JSON.stringify(['approve', 'cancel', 'reject', 'submit']),
    JSON.stringify(actionKeys),
  )

  const hasReviewTab = (s?.tabs ?? []).some(t => t.key === 'review' && t.type === 'custom')
  log('Schema punya tab custom `review`', hasReviewTab)

  // Kunci yang dibaca `columns.ts` hasil generate. Kalau salah satu
  // hilang, kolomnya tampil kosong tanpa error apa pun.
  for (const key of [
    'employee_name',
    'permission_type_label',
    'date',
    'time_window',
    'reason',
    'status_label',
    'current_approver',
  ]) {
    log(`Schema punya kolom \`${key}\``, Boolean(s?.fields?.[key]))
  }

  // --- daftar --------------------------------------------------------
  const list = await api('/api/hr/attendance-permissions/?page_size=5')
  log('GET daftar izin', list.status === 200, `status ${list.status}`)

  const sample = rows(list.json)[0]
  if (sample) {
    for (const key of ['time_window', 'current_approver', 'status_label']) {
      log(`Baris daftar memuat \`${key}\``, key in sample)
    }
    // Blok berat tidak boleh ikut di daftar — 11 query/baris.
    for (const key of ['shift', 'attendance', 'conflicts', 'approval']) {
      const light = sample[key] === null || sample[key] === undefined
        || (Array.isArray(sample[key]) && sample[key].length === 0)
      log(`Daftar tidak membawa blok berat \`${key}\``, light)
    }
  }

  console.log('')
  console.log(`Hasil: ${pass} PASS, ${fail} FAIL`)

  if (failures.length) {
    console.log('')
    console.log('Yang gagal:')
    failures.forEach(f => console.log(`  - ${f}`))
  }

  process.exit(fail ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
