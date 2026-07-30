import { h } from "vue"
import type { ColumnDef } from "@tanstack/vue-table"

import { Checkbox } from "@/components/ui/checkbox"
import { MColumnHeader, MCrudActions } from "@framework"

import type { CrudAction, CrudColumn } from "./types"

type CheckState = boolean | "indeterminate"

function renderCell<T>(item: CrudColumn<T>, row: any) {
  const value = row.original[item.key]

  if (item.render) {
    return item.render(value, row.original)
  }

  if (item.formatter) {
    return h(
      "div",
      { class: item.className ?? "text-muted-foreground" },
      item.formatter(value, row.original),
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
        value ? "Active" : "Inactive",
      )

    case "boolean":
      return h(
        "span",
        { class: "text-muted-foreground" },
        value ? "Yes" : "No",
      )

    case "number":
      return h(
        "span",
        { class: "text-muted-foreground" },
        value == null ? "-" : Number(value).toLocaleString("id-ID"),
      )

    default:
      return h(
        "div",
        { class: item.className ?? "text-muted-foreground" },
        String(value ?? "-"),
      )
  }
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
      header: () => h("div", { class: "text-left" }, "Actions"),
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) =>
        h("div", { class: "flex justify-end" }, [
          h(MCrudActions, {
            row: row.original,
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