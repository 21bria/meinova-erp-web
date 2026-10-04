import {
  BadgeDollarSign,
  Banknote,
  BellRing,
  BarChart3,
  BriefcaseBusiness,
  Building,
  Building2,
  Calculator,
  CalendarCheck,
  CalendarCog,
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  ChartColumn,
  Clock3,
  Coins,
  Contact,
  ContactRound,
  Database,
  DoorOpen,
  Factory,
  FileChartColumn,
  FileSignature,
  FileText,
  GitBranch,
  GraduationCap,
  Handshake,
  History,
  IdCard,
  Inbox,
  Landmark,
  Mail,
  MailCheck,
  LayoutDashboard,
  ListOrdered,
  Map,
  Package,
  Plane,
  ReceiptText,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  UserPlus,
  UserRoundCog,
  Users,
  Wallet,
  WalletMinimal,
  Workflow,
} from 'lucide-vue-next'

export const appRegistry: Record<string, any> = {
  // Notifikasi. Wajib ada di sini, bukan cuma di menu: sidebar memakai
  // `i-lucide-*` apa adanya, tapi pintasan di beranda memetakannya
  // lewat registry ini.
  //
  // PERIKSA NAMANYA BENAR-BENAR DIEKSPOR `lucide-vue-next` sebelum
  // menambah baris di sini. Kunci yang tidak dikenal di *peta* cuma
  // jatuh ke kotak polos tanpa error — tapi nama yang salah di *impor*
  // di atas menggagalkan pemuatan modul dan **menjatuhkan seluruh
  // aplikasi dengan 500**, bukan cuma satu ikon. Sudah kena sekali:
  // `MailCog` ada di iconify tapi tidak ada di lucide-vue-next 0.482,
  // dan akibatnya beranda tidak bisa dibuka sama sekali.
  //
  //   node -e "console.log('MailCog' in require('lucide-vue-next'))"
  mail: {
    icon: Mail,
  },

  'bell-ring': {
    icon: BellRing,
  },

  'mail-check': {
    icon: MailCheck,
  },

  'building-2': {
    icon: Building2,
  },

  'calendar-check': {
    icon: CalendarCheck,
  },

  users: {
    icon: Users,
  },

  wallet: {
    icon: Wallet,
  },

  package: {
    icon: Package,
  },

  factory: {
    icon: Factory,
  },

 workflow: {
    icon: Workflow,
  },
  
  'receipt-text': {
    icon: ReceiptText,
  },

  'file-text': {
    icon: FileText,
  },

  handshake: {
    icon: Handshake,
  },

  'chart-column': {
    icon: ChartColumn,
  },

  'bar-chart-3': {
    icon: BarChart3,
  },

  'settings-2': {
    icon: Settings2,
  },

  // Dipakai KPI dan Quick Action beranda; namanya ditentukan backend
  // (`quick_actions.py`, `summary_service.py`). Kunci yang tidak dikenal
  // jatuh ke ikon bawaan, jadi salah ketik di sini gagal tanpa suara.
  inbox: {
    icon: Inbox,
  },

  send: {
    icon: Send,
  },

  'user-plus': {
    icon: UserPlus,
  },

  'calendar-plus': {
    icon: CalendarPlus,
  },

  plane: {
    icon: Plane,
  },

  // Ikon menu sidebar, dipakai pintasan **Favorite Menus**.
  //
  // Katalognya tabel `Menu` di backend, yang menyimpan nama bergaya
  // Nuxt UI (`i-lucide-clock-3`); `menu_catalog.py` membuang awalannya
  // dan kunci di bawah ini yang mencocokkannya. Nama yang tidak dikenal
  // jatuh ke ikon bawaan tanpa error — jadi menu baru yang ikonnya
  // belum ada di sini tampil sebagai kotak polos, bukan halaman rusak.
  'badge-dollar-sign': { icon: BadgeDollarSign },
  // `BanknoteArrowUp` belum ada di versi lucide yang terpasang; ikon
  // menunya sendiri tetap `i-lucide-banknote-arrow-up` di sidebar.
  'banknote-arrow-up': { icon: Banknote },
  'briefcase-business': { icon: BriefcaseBusiness },
  building: { icon: Building },
  calculator: { icon: Calculator },
  'calendar-cog': { icon: CalendarCog },
  'calendar-days': { icon: CalendarDays },
  'calendar-range': { icon: CalendarRange },
  'clock-3': { icon: Clock3 },
  coins: { icon: Coins },
  contact: { icon: Contact },
  'contact-round': { icon: ContactRound },
  'door-open': { icon: DoorOpen },
  database: { icon: Database },
  'file-chart-column': { icon: FileChartColumn },
  'file-signature': { icon: FileSignature },
  'git-branch': { icon: GitBranch },
  'graduation-cap': { icon: GraduationCap },
  history: { icon: History },
  'id-card': { icon: IdCard },
  landmark: { icon: Landmark },
  'layout-dashboard': { icon: LayoutDashboard },
  'list-ordered': { icon: ListOrdered },
  map: { icon: Map },
  'shield-check': { icon: ShieldCheck },
  'sliders-horizontal': { icon: SlidersHorizontal },
  'user-cog': { icon: UserCog },
  'user-round-cog': { icon: UserRoundCog },
  'wallet-minimal': { icon: WalletMinimal },
}