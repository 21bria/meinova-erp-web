

echo "Generate Geography Master..."

pnpm meinova generate references/geography/countries
pnpm meinova generate references/geography/provinces
pnpm meinova generate references/geography/cities

echo "Done."