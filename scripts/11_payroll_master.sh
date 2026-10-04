echo "========================================="
echo "Generate Payroll Master Modules"
echo "========================================="

# Aturan perhitungan per kelompok pegawai (Payroll Policy).
pnpm meinova generate payroll/payroll-policies
pnpm meinova generate payroll/payroll-groups
pnpm meinova generate payroll/salary-grades
pnpm meinova generate payroll/salary-levels
pnpm meinova generate payroll/tax-statuses
pnpm meinova generate payroll/overtime-groups

# Tingkat pengali lembur (Business Decision #4). Layar tersendiri,
# mengikuti pola Allowance Component terhadap Allowance Template.
pnpm meinova generate payroll/overtime-group-tiers
pnpm meinova generate payroll/allowance-templates
pnpm meinova generate payroll/deduction-templates

echo ""
echo "✅ Payroll Master Modules Generated Successfully"
echo "========================================="