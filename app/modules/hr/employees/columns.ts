import { h } from "vue"

import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { MIdentityCell, column, createColumns, resourceLabel } from "@framework"

import { employeeAvatar } from "./avatar"
import type { EmployeesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmployeesRow) => void
  onDelete?: (row: EmployeesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmployeesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmployeesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmployeesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      /*
       * Satu kolom untuk tiga yang dulu terpisah: foto + nama utuh,
       * dengan nomor pegawainya sebagai baris kedua.
       *
       * Kuncinya `first_name` dan itu disengaja — kolomnya tetap bisa
       * diurutkan, dan urutannya cocok dengan yang dibaca mata karena
       * nama depan adalah awal teks yang ditampilkan. `full_name`
       * properti turunan, bukan kolom; `ordering=full_name` dibuang
       * DRF tanpa satu pun pesan, jadi kepalanya akan bisa diklik dan
       * tidak melakukan apa-apa.
       */
      column.custom<EmployeesRow>(
        "first_name",
        resourceLabel("hr.employees.fields.employee", "Employee"),
        (_value, row) => {
          // Foto dari payload daftar (`avatar_display`), bukan dari
          // permintaan per baris: pegawai tanpa foto tidak memicu satu
          // pun unduhan, yang berfoto diunduh sekali per alamat.
          const avatar = employeeAvatar(row)

          return h(MIdentityCell, {
            title: avatar.name,
            caption: row.employee_number,
            src: avatar.src,
            initials: avatar.initials,
          })
        },
      ),
      column.text("nik", resourceLabel("hr.employees.fields.nik", "NIK")),
      column.text("gender_name", resourceLabel("hr.employees.fields.gender", "Gender")),
      column.text("work_email", resourceLabel("hr.employees.fields.work_email", "Work Email")),
      column.text("mobile", resourceLabel("hr.employees.fields.mobile", "Mobile")),
      column.status("is_active", resourceLabel("hr.employees.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("hr.employees.fields.company", "Company")),
      column.text("location_name", resourceLabel("hr.employees.fields.location", "Location")),
      column.text("employment_status_name", resourceLabel("hr.employees.fields.employment_status", "Employment Status")),
      column.text("employment_type_name", resourceLabel("hr.employees.fields.employment_type", "Employment Type")),
      column.date("join_date", resourceLabel("hr.employees.fields.join_date", "Join Date")),

    ],
  })
}
