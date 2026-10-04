import fields from './workflow-fields'

/*
| Label field per layar dipisah ke `workflow-fields.ts` dan
| di-spread di sini.
|
| Dua sifat yang berbeda: berkas ini kalimat yang ditulis orang
| (judul layar, nama aksi), sementara `workflow-fields.ts` adalah peta
| field→label yang berpasangan satu-satu dengan `label=` di schema
| backend. Mencampurnya membuat yang kedua sulit dibandingkan dengan
| sumbernya.
*/
export default {
  ...fields,

  title: 'Alur Persetujuan',
  definition: 'Definisi Alur',
  definitionPlural: 'Definisi Alur',
  step: 'Tahap Persetujuan',
  stepPlural: 'Tahap Persetujuan',
  delegation: 'Pendelegasian',
  delegationPlural: 'Pendelegasian',
  myApprovals: 'Persetujuan Saya',
  mySubmissions: 'Pengajuan Saya',
  runningDocuments: 'Dokumen Berjalan',

  actions: {
    submit: 'Ajukan',
    approve: 'Setujui',
    reject: 'Tolak',
    delegate: 'Delegasikan',
    cancel: 'Batalkan',
  },

  fields: {
    approver: 'Penyetuju',
    decided_at: 'Waktu Keputusan',
    comment: 'Komentar',
    stage: 'Tahap',
  },
} as const
