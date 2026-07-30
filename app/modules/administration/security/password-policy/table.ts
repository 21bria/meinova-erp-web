
import type { MasterTableConfig } from "@/types/table"


// password-policy/table.ts
export const passwordPolicyConfig : MasterTableConfig = {
  id: "master-password-policy",
  endpoint: "/api/accounts/password-policy/",
  defaultQuery: {},
}