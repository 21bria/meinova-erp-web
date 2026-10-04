import { h } from "vue"
import type { ColumnDef } from "@tanstack/vue-table"

import { Checkbox } from "@/components/ui/checkbox"
import { MColumnHeader, MCrudActions } from "@framework"

import {
  formatDate,
  formatDateTime,
} from "@/utils/formatDate"

/*
 * Lewat jalur relatif, bukan `@framework`: berkas ini sendiri ikut
 * di-re-export barrel itu.
 */
import { codeLabel, enumCodeField, formatLocaleNumber, statusLabel, translate } from "../../core/utils/i18n"

import type { CrudAction, CrudColumn } from "./types"

type CheckState = boolean | "indeterminate"

function renderCell<T>(
  item: CrudColumn<T>,
  row: any,
) {
  const value = row.original[item.key]

  if (item.render) {
    return item.render(
      value,
      row.original,
    )
  }

  if (item.formatter) {
    return h(
      "div",
      {
        class:
          item.className
          ?? "text-muted-foreground",
      },
      item.formatter(
        value,
        row.original,
      ),
    )
  }

  switch (item.type) {
    case "status":
      return h(
        "span",
        {
          class: value
            ? "font-medium text-green-600"
            : "font-medium text-red-600",
        },
        /*
         * Yang diterjemahkan **tampilannya**. `value` tetap boolean
         * milik baris itu, dan tidak ada satu pun perbandingan di
         * bawah yang memakai teks hasil terjemahan.
         *
         * `renderCell` dipanggil ulang tiap render, jadi sel ikut
         * berganti bahasa tanpa kolomnya perlu dirakit ulang.
         */
        value
          ? statusLabel("active", "Active")
          : statusLabel("inactive", "Inactive"),
      )

    case "boolean":
      return h(
        "span",
        {
          class:
            "text-muted-foreground",
        },
        value
          ? translate("common.status.yes", "Yes")
          : translate("common.status.no", "No"),
      )

    case "number":
      return h(
        "span",
        {
          class:
            "text-muted-foreground",
        },
        value == null
          ? "-"
          // Dulu `toLocaleString("id-ID")` — pengguna English melihat
          // "1.234.567" dan membacanya sebagai angka pecahan. Nilainya
          // tidak disentuh; yang berubah cuma tanda bacanya.
          : formatLocaleNumber(Number(value)),
      )

    case "date":
      return h(
        "span",
        {
          class:
            item.className
            ?? "text-muted-foreground",
        },
        formatDate(
          value,
        ),
      )

    case "datetime":
      return h(
        "span",
        {
          class:
            item.className
            ?? "text-muted-foreground",
        },
        formatDateTime(
          value,
        ),
      )

    default:
      return h(
        "div",
        {
          class:
            item.className
            ?? "text-muted-foreground",
        },
        enumText(item, row) ?? String(value ?? "-"),
      )
  }
}

/**
 * Teks kolom yang ternyata tampilan sebuah kode enum, atau `null`.
 *
 * Serializer di repo ini mengirim **dua** field berpasangan: kode yang
 * stabil (`status`, `approver_type`) dan tampilan bahasa Inggrisnya
 * (`status_label`, `approver_type_label`). Kolom memakai yang kedua,
 * jadi tanpa langkah ini layar Workflow selalu bahasa Inggris apa pun
 * pilihan orangnya.
 *
 * Tiga syarat yang harus benar bersamaan, dan ketiganya ada supaya
 * fungsi ini **tidak pernah** menyentuh data bisnis:
 *
 *   1. nama kolomnya berakhiran `_label`/`_display` — `_name` tidak
 *      ikut, dan itulah yang memisahkan "tampilan enum" dari "nama
 *      milik tenant" (`company_name`, `department_name`)
 *   2. barisnya benar-benar membawa field kodenya
 *   3. kodenya sebuah string — FK yang mengirim id angka dilewati
 *
 * Kalau kodenya tidak punya terjemahan, `codeLabel` mengembalikan
 * label Inggris dari API apa adanya. Jadi kegagalan terburuknya adalah
 * layar yang persis seperti sebelum tahap ini.
 */
function enumText<T>(item: CrudColumn<T>, row: any): string | null {
  const field = enumCodeField(String(item.key))

  if (!field)
    return null

  const code = row.original?.[field]

  if (typeof code !== "string" || !code)
    return null

  const display = row.original[item.key]

  return codeLabel(
    field,
    code,
    display == null ? null : String(display),
  )
}

export function createColumns<T>(config: {
  items: CrudColumn<T>[]
  selectable?: boolean
  canMutate?: boolean
  actions?: CrudAction<T>
}): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = []

  if (config.selectable) {
    columns.push({
      id: "select",
      enableSorting: false,
      enableHiding: false,
      size: 40,
      header: ({ table }) =>
        h(Checkbox, {
          modelValue: table.getIsAllPageRowsSelected(),
          "onUpdate:modelValue": (v: CheckState) =>
            table.toggleAllPageRowsSelected(v === true),
          indeterminate: table.getIsSomePageRowsSelected(),
          onClick: (e: MouseEvent) => e.stopPropagation(),
        }),
      cell: ({ row }) =>
        h(Checkbox, {
          modelValue: row.getIsSelected(),
          "onUpdate:modelValue": (v: CheckState) =>
            row.toggleSelected(v === true),
          onClick: (e: MouseEvent) => e.stopPropagation(),
        }),
    })
  }

  const dataItems = config.items.filter(item =>
    item.key !== "is_active"
    && item.key !== "active"
    && item.type !== "status",
  )

  const statusItems = config.items.filter(item =>
    item.key === "is_active"
    || item.key === "active"
    || item.type === "status",
  )

    ;[...dataItems, ...statusItems].forEach((item) => {
      columns.push({
        accessorKey: item.key,
        enableSorting: item.sortable ?? true,
        header: ({ column }) =>
          h(MColumnHeader, {
            column,
            title: item.title ?? item.key,
          }),
        cell: ({ row }) => renderCell(item, row),
      })
    })

  const hasActions = Boolean(
    config.actions?.onEdit
    || config.actions?.onDelete,
  )

  if (config.canMutate && hasActions) {
    columns.push({
      id: "actions",
      header: () => h(
        "div",
        { class: "text-left" },
        translate("common.actions.actions", "Actions"),
      ),
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) =>
        h("div", { class: "flex justify-end" }, [
          h(MCrudActions, {
            row: row.original,

            /*
             * `showEdit` / `showDelete` harus dioper eksplisit.
             * Keduanya bawaannya `true` di `MCrudActions`, sementara
             * yang dioper di sini cuma handler-nya — jadi resource yang
             * mematikan salah satunya lewat schema (`ui.delete: false`)
             * tetap menampilkan item menunya, dan item itu **tidak
             * melakukan apa pun** waktu ditekan karena tidak ada yang
             * mendengarkan. Terlihat pertama kali di Payroll Review,
             * yang baris pegawainya memang tidak pernah boleh dihapus.
             *
             * Barisnya sendiri boleh menolak lebih jauh lewat
             * `can_edit` / `can_delete` — aturan yang sering **per
             * baris**, bukan per resource: satu payroll run boleh
             * dihapus selama Draft dan tidak lagi sesudah difinalisasi.
             * Resource yang tidak mengirim kedua field itu tidak
             * berubah sama sekali (`undefined !== false`).
             */
            showEdit: Boolean(config.actions?.onEdit)
              && (row.original as any)?.can_edit !== false,
            showDelete: Boolean(config.actions?.onDelete)
              && (row.original as any)?.can_delete !== false,

            onEdit: config.actions?.onEdit
              ? () => config.actions?.onEdit?.(row.original)
              : undefined,
            onDelete: config.actions?.onDelete
              ? () => config.actions?.onDelete?.(row.original)
              : undefined,
          }),
        ]),
    })
  }

  return columns
}