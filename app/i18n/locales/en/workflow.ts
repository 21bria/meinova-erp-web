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

  title: 'Workflow',
  definition: 'Workflow Definition',
  definitionPlural: 'Workflow Definitions',
  step: 'Approval Step',
  stepPlural: 'Approval Steps',
  delegation: 'Delegation',
  delegationPlural: 'Delegations',
  myApprovals: 'My Approvals',
  mySubmissions: 'My Submissions',
  runningDocuments: 'Running Documents',

  actions: {
    submit: 'Submit',
    approve: 'Approve',
    reject: 'Reject',
    delegate: 'Delegate',
    cancel: 'Cancel',
  },

  fields: {
    approver: 'Approver',
    decided_at: 'Decided At',
    comment: 'Comment',
    stage: 'Stage',
  },
} as const
