echo "========================================="
echo "Generate Asset Management Modules"
echo "========================================="

# Kategori — editor dialog (master sederhana).
pnpm meinova generate assets/categories

# Register + tiga dokumen pergerakan — editor workspace. Tab `custom`
# (Overview, Custody/Condition History, Documents, Summary) diisi
# komponen tulis tangan di `app/modules/assets/<x>/detail/` dan
# `app/modules/assets/shared/` lewat slot di `app/pages/assets/**`;
# generator tidak menyentuh folder itu.
pnpm meinova generate assets/register
pnpm meinova generate assets/assignments
pnpm meinova generate assets/returns
pnpm meinova generate assets/transfers

echo ""
echo "✅ Asset Management Modules Generated Successfully"
echo "========================================="
