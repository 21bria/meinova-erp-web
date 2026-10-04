import type { VNodeChild } from "vue"

import { translate } from "../../core/utils/i18n"

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

  date<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "date",
    }
  },

  datetime<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "datetime",
    }
  },

  currency<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "currency",
    }
  },

  percent<T>(
    key: keyof T & string,
    title?: string,
  ): CrudColumn<T> {
    return {
      key,
      title,
      type: "percent",
    }
  },

  status<T>(
    key: keyof T & string = "is_active" as keyof T & string,
    /*
     * Default dievaluasi **tiap pemanggilan**, bukan sekali saat modul
     * dimuat — jadi judul bawaannya ikut bahasa yang berlaku saat
     * kolomnya dirakit. Modul hasil generate mengirim labelnya sendiri
     * dan tidak menyentuh jalur ini.
     */
    title = translate("common.labels.status", "Status"),
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

  /*
   * Kolom yang selnya digambar sendiri.
   *
   * `key` tetap kunci sungguhan milik baris, bukan nama karangan:
   * dialah yang dikirim sebagai `ordering` saat kolomnya diurutkan
   * (lihat `useCrud.onSort`), jadi kolom gabungan tetap bisa diurutkan
   * selama kuncinya sebuah field yang dikenal backend. Kunci karangan
   * menghasilkan kolom yang kepalanya bisa diklik dan tidak mengubah
   * apa pun — gagal yang diam.
   */
  custom<T>(
    key: keyof T & string,
    title: string,
    render: (value: any, row: T) => VNodeChild,
  ): CrudColumn<T> {
    return {
      key,
      title,
      render,
    }
  },
}