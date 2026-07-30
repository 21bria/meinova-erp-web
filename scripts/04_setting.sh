
echo "Generate System Master..."

pnpm meinova generate administration/settings/tenant-setting
pnpm meinova generate administration/settings/system-setting
pnpm meinova generate administration/settings/print-setting

echo "Done."