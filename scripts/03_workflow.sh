
echo "Generate Workflow Master..."

pnpm meinova generate administration/workflow/definitions
pnpm meinova generate administration/workflow/steps
pnpm meinova generate administration/workflow/instances
pnpm meinova generate administration/workflow/approvals
pnpm meinova generate administration/workflow/delegations

echo "Done."