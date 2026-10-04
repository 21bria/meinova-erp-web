export default {
  title: 'Payroll',

  period: {
    title: 'Payroll Period',
    titlePlural: 'Payroll Periods',
  },

  run: {
    title: 'Payroll Run',
    review: 'Payroll Review',
    summary: 'Payroll Summary',
    input: 'Payroll Input',
  },

  payslip: {
    title: 'Payslip',
    titlePlural: 'Payslips',
  },

  component: {
    // Kunci di sini adalah **kode komponen sistem** yang dipakai
    // perhitungan, bukan namanya. Nilai yang tersimpan dan seluruh
    // rumus tetap memakai kodenya.
    basic_salary: 'Basic Salary',
    allowance: 'Allowance',
    deduction: 'Deduction',
    overtime: 'Overtime',
    gross_pay: 'Gross Pay',
    net_pay: 'Net Pay',
    tax: 'Tax',
    bpjs: 'BPJS',
  },
} as const
