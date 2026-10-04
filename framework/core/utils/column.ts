import { h } from "vue"
import type { ColumnDef } from "@tanstack/vue-table"

import { Checkbox } from "@/components/ui/checkbox"
import { MColumnHeader, MCrudActions } from "@framework"

import { statusLabel, translate } from "./i18n"

type CheckState = boolean | "indeterminate"

type BuilderActions<T> = {
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}

type BuilderOptions<T> = {
  canMutate?: boolean
  actions?: BuilderActions<T>
}

export function textColumn<T>(
  key: keyof T & string,
  title: string,
  className = "text-muted-foreground",
): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => h(MColumnHeader, { column, title }),
    cell: ({ row }) =>
      h("div", { class: className }, String(row.original[key] ?? "-")),
    enableSorting: true,
  }
}

export function statusColumn<T>(
  key: keyof T & string = "is_active" as keyof T & string,
): ColumnDef<T> {
  return {
    accessorKey: key,
    /*
     * `header` dan `cell` dipanggil ulang tiap render, jadi keduanya
     * ikut berganti bahasa tanpa kolomnya perlu dirakit ulang.
     *
     * Yang **tidak** berubah: nilai yang dibaca tetap boolean milik
     * baris itu, dan tidak ada satu pun perbandingan yang memakai teks
     * hasil terjemahan.
     */
    header: ({ column }) =>
      h(MColumnHeader, { column, title: translate("common.labels.status", "Status") }),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-muted-foreground" },
        row.original[key]
          ? statusLabel("active", "Active")
          : statusLabel("inactive", "Inactive"),
      ),
    enableSorting: true,
  }
}

export function selectColumn<T>(disabled = false): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (v: CheckState) =>
          table.toggleAllPageRowsSelected(v === true),
        indeterminate: table.getIsSomePageRowsSelected(),
        onClick: (e: MouseEvent) => e.stopPropagation(),
        disabled,
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (v: CheckState) =>
          row.toggleSelected(v === true),
        onClick: (e: MouseEvent) => e.stopPropagation(),
        disabled,
      }),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }
}

export function actionsColumn<T>(actions: BuilderActions<T>): ColumnDef<T> {
  return {
    id: "actions",
    header: () => h(
      "div",
      { class: "text-left" },
      translate("common.actions.actions", "Actions"),
    ),
    cell: ({ row }) =>
      h("div", { class: "flex justify-end" }, [
        h(MCrudActions, {
          row: row.original,
          onEdit: actions.onEdit,
          onDelete: actions.onDelete,
        }),
      ]),
  }
}

export function buildCrudColumns<T>(
  columns: ColumnDef<T>[],
  options: BuilderOptions<T> = {},
): ColumnDef<T>[] {
  const result: ColumnDef<T>[] = []

  result.push(selectColumn<T>(!options.canMutate))
  result.push(...columns)

  if (options.canMutate && options.actions) {
    result.push(actionsColumn(options.actions))
  }

  return result
}