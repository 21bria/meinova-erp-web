import type { CrudColumn } from "./types"

export const column = {
  text<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "text",
    }
  },

  number<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "number",
    }
  },

  status<T>(
    key: keyof T & string = "is_active" as keyof T & string,
    title = "Status",
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "status",
    }
  },

  badge<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "badge",
    }
  },

  boolean<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "boolean",
    }
  },
}