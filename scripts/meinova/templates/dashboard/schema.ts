import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/__modulePath__/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate __modulePath__`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const __camelName__Schema: DashboardSchema = __schemaJson__
