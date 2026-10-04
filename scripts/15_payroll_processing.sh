echo "========================================="
echo "Generate Payroll Processing Modules"
echo "========================================="

# Transaksi. Tiga yang pertama workspace bertab; tombol prosesnya
# (Generate Employees, Calculate, Submit, Finalize) datang dari
# `actions` di schema backend, bukan ditulis di sini.
pnpm meinova generate payroll/payroll-periods
pnpm meinova generate payroll/payroll-runs
pnpm meinova generate payroll/payroll-run-employees
pnpm meinova generate payroll/payroll-inputs
pnpm meinova generate payroll/payslips

# Konfigurasi yang menempel di Payroll Master existing. Master-nya
# sendiri tetap digenerate lewat 11_payroll_master.sh dan tidak
# disentuh dari sini.
pnpm meinova generate payroll/allowance-template-lines
pnpm meinova generate payroll/deduction-template-lines
pnpm meinova generate payroll/leave-rules
pnpm meinova generate payroll/tax-brackets

# Kebijakan penggajian per perusahaan (Business Decision #1: prorata).
pnpm meinova generate payroll/payroll-settings

echo ""
echo "✅ Payroll Processing Modules Generated Successfully"
echo "========================================="
