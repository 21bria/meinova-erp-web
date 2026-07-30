echo "========================================="
echo "Generate Payroll Master Modules"
echo "========================================="

pnpm meinova generate payroll/payroll-groups
pnpm meinova generate payroll/salary-grades
pnpm meinova generate payroll/salary-levels
pnpm meinova generate payroll/tax-statuses
pnpm meinova generate payroll/overtime-groups
pnpm meinova generate payroll/allowance-templates
pnpm meinova generate payroll/deduction-templates

echo ""
echo "✅ Payroll Master Modules Generated Successfully"
echo "========================================="