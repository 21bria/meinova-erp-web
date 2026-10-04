import { Building2, Square } from 'lucide-vue-next'

import {
  appColorOverride,
  appRegistry,
  colorRegistry,
} from '~/registry'

/**
 * Label tanggal untuk kartu ringkas.
 *
 * Backend mengirim ISO datetime apa adanya. Beranda cuma butuh "kapan
 * kira-kira", bukan jam menitnya — dan "Today" jauh lebih cepat dibaca
 * daripada "2026-08-11T09:14:03Z" di dalam badge selebar 80px.
 */
export function shortDay(value?: string | null): string {
  if (!value)
    return ''

  const at = new Date(value)

  if (Number.isNaN(at.getTime()))
    return String(value)

  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

  const days = Math.round((startOf(new Date()) - startOf(at)) / 86_400_000)

  if (days === 0)
    return 'Today'

  if (days === 1)
    return 'Yesterday'

  if (days > 1 && days < 7)
    return `${days} days ago`

  return at.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: at.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}

/** Kode status `WorkflowInstance` → label yang dibaca orang. */
const WORKFLOW_STATUS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  returned: 'Returned',
}

function iconOf(name?: string, fallback: any = Square) {
  return appRegistry[name ?? '']?.icon ?? fallback
}

function textColorOf(name?: string) {
  return colorRegistry[name ?? '']?.text ?? 'text-muted-foreground'
}

function badgeColorOf(name?: string) {
  const color = colorRegistry[name ?? '']

  return color ? `${color.bg} ${color.text}` : 'bg-muted text-muted-foreground'
}

export function mapKpis(items: any[] = []) {
  return items.map(item => ({
    code: item.code,
    title: item.title,
    value: item.value ?? 0,
    href: item.link,
    icon: iconOf(item.icon),
    color: textColorOf(item.color),
    // Latar seukuran ikonnya, bukan seluruh kartu: empat kartu
    // berlatar warna berjejer membuat angkanya — yang justru jadi
    // alasan kartu itu ada — harus bersaing dengan latarnya sendiri.
    badge: badgeColorOf(item.color),
  }))
}

export function mapQuickActions(items: any[] = []) {
  return items.map(item => ({
    code: item.code,
    title: item.title,
    description: item.description ?? '',
    href: item.link,
    icon: iconOf(item.icon),
    color: badgeColorOf(item.color),
    // Backend mengirim katalog **beserta** mana yang dipilih; yang
    // tidak menyebutkannya dianggap terpilih, supaya beranda tidak
    // pernah kosong hanya karena bentuk respons berubah.
    selected: item.is_selected !== false,
  }))
}

/**
 * Donut backend mengirim `series: [{label, value}]`; komponen chart-nya
 * menuntut dua array sejajar (`series: number[]`, `labels: string[]`).
 * Dipisah di sini supaya komponennya tidak perlu tahu bentuk API.
 */
export function mapCharts(items: any[] = []) {
  return items.map((item) => {
    const series = Array.isArray(item.series) ? item.series : []

    if (item.type === 'donut') {
      return {
        code: item.code,
        title: item.title,
        type: 'donut',
        series: series.map((row: any) => row.value ?? 0),
        categories: series.map((row: any) => row.label ?? ''),
        // Kode status ikut dibawa, bukan cuma labelnya.
        //
        // Label dari backend sudah berupa kalimat jadi ("Pending") dan
        // tidak bisa diterjemahkan; kodenya (`pending`) yang cocok
        // dengan `common.status.*` — kunci yang sama dengan seluruh
        // aplikasi. Kartu Approval Status di kolom kanan memakai ini;
        // chart donut tidak menyentuhnya sama sekali.
        codes: series.map((row: any) => String(row.code ?? '')),
        total: item.total ?? 0,
      }
    }

    return { ...item, categories: item.categories ?? [] }
  })
}

export function mapNotifications(items: any[] = []) {
  return items.map(item => ({
    id: String(item.id),
    title: item.title,
    description: item.description ?? '',
    type: String(item.type ?? 'INFO').toLowerCase(),
    href: item.link || undefined,
    is_read: item.is_read ?? false,
    created_at: shortDay(item.created_at),
  }))
}

export function mapWorkflows(items: any[] = []) {
  return items.map(item => ({
    id: String(item.id),
    title: item.title,
    document_number: item.document_number ?? '',
    // `module` disimpan lowercase di backend ("hr", "payroll").
    module: String(item.module ?? '').toUpperCase(),
    requester: item.requester ?? '-',
    // Kode mentahnya ikut dibawa: label di atas cuma cadangan untuk
    // status yang belum punya terjemahan, sedangkan yang menentukan
    // warna badge dan bunyi teksnya adalah kodenya.
    status_code: String(item.status ?? ''),
    status: WORKFLOW_STATUS[item.status] ?? item.status,
    created_at: shortDay(item.created_at),
  }))
}

export function mapFavoriteApps(items: any[] = []) {
  return items.map((item) => {
    const icon = appRegistry[item.icon]

    // Penimpa dulu, baru warna katalog. Kuncinya kode modul, dan
    // modul yang tidak disebut di peta penimpa — yaitu hampir
    // semuanya — jatuh ke warna yang dikirim backend apa adanya.
    const color = colorRegistry[appColorOverride[item.app_code] ?? item.color]

    return {
      code: item.app_code,
      title: item.title,
      description: item.description,
      href: item.link,
      icon: icon?.icon ?? Building2,
      // Ubin ikon launcher memakai token `vivid` (tiga titik henti
      // pekat, ikon putih di atasnya), bukan `bg` yang nilainya sudah
      // beropasitas rendah — ubin launcher justru satu-satunya tempat
      // warna penuh dipakai di beranda.
      color: color?.vivid ?? '',
      /** Bayangan bersemu warna ubinnya; kosong = bayangan netral. */
      glow: color?.glow ?? '',
      badge: item.badge,
      status: item.status,
      // Endpoint katalog mengirim `is_favorite`; endpoint favorit tidak,
      // karena seluruh isinya memang sudah dipilih.
      favorite: item.is_favorite ?? true,
      // Dua penanda dari katalog, dan bawaannya `true` supaya endpoint
      // favorit — yang isinya memang sudah tersaring hak akses dan
      // tidak mengirim keduanya — tidak mendadak jadi kelabu semua.
      accessible: item.is_accessible ?? true,
      available: item.is_available ?? true,
      position: item.position ?? 0,
    }
  })
}

export function mapFavoriteMenus(items: any[] = []) {
  return items.map((item) => {
    const icon = appRegistry[item.icon]
    const color = colorRegistry[item.color]

    return {
      code: item.menu_code,
      title: item.title,
      description: item.description ?? '',
      href: item.link,
      icon: icon?.icon ?? Square,
      color: color ? `${color.bg} ${color.text}` : '',
      badge: item.badge,
      // Sama seperti `mapFavoriteApps`: endpoint katalog mengirim
      // `is_favorite`, endpoint favorit tidak — seluruh isinya memang
      // sudah dipilih.
      favorite: item.is_favorite ?? true,
      is_visible: item.is_visible,
      position: item.position ?? 0,
    }
  })
}


/**
 * Sorotan hari ini. Bentuknya sudah siap pakai dari backend, jadi yang
 * dilakukan di sini cuma menjaga baris yang tidak lengkap tidak ikut
 * masuk — satu kartu tanpa judul di kepala halaman lebih mencolok
 * daripada di tengah tabel.
 */
export function mapHighlights(items: any[] = []) {
  return (Array.isArray(items) ? items : [])
    .filter(item => item?.title)
    .map(item => ({
      kind: String(item.kind ?? "info"),
      title: String(item.title),
      subtitle: String(item.subtitle ?? ""),
      icon: item.icon ?? undefined,
    }))
}

/**
 * Jumlah dokumen berstatus `pending` untuk badge di kepala kartu
 * Approval Status saat terlipat.
 *
 * Dibaca dari chart yang sudah ada, **bukan** angka baru: kartu yang
 * terlipat tidak boleh menampilkan hitungan yang tidak akan cocok
 * dengan isinya sendiri begitu dibuka.
 */
export function pendingApprovalCount(charts: any[] = []): number {
  for (const chart of charts) {
    const index = (chart?.codes ?? []).indexOf('pending')

    if (index >= 0)
      return Number(chart.series?.[index] ?? 0)
  }

  return 0
}
