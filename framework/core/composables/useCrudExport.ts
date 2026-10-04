import { ref } from "vue"
import { translate } from "../utils/i18n"

import { useApi } from "@/composables/useApi"

type Notify = {
  info: (message: string) => void
  error: (message: string) => void
  success?: (message: string) => void
}

type Options = {
  /** Endpoint export. Default: `<endpoint>export/` */
  endpoint?: string

  /** Endpoint template import, dipakai downloadTemplate() */
  templateEndpoint?: string

  /** Nama file bila server tidak mengirim Content-Disposition */
  filename?: string

  /** Query tambahan, biasanya filter tabel yang sedang aktif */
  query?: () => Record<string, any>

  notify?: Notify
}

function filenameFromDisposition(
  value: string | null,
): string | null {
  if (!value)
    return null

  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(value)

  return match?.[1]
    ? decodeURIComponent(match[1])
    : null
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")

  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

export function useCrudExport(options: Options = {}) {
  const { rawRequest } = useApi()

  const loading = ref(false)

  async function download(
    endpoint: string | undefined,
    fallbackName: string,
    query?: Record<string, any>,
  ) {
    if (!endpoint) {
      options.notify?.error("Endpoint belum dikonfigurasi")
      return
    }

    loading.value = true

    try {
      const response = await rawRequest(endpoint, {
        method: "GET",
        query,
      })

      if (!response.ok) {
        throw new Error(
          `Request gagal dengan status ${response.status}`,
        )
      }

      const blob = await response.blob()

      const name = filenameFromDisposition(
        response.headers.get("content-disposition"),
      ) ?? fallbackName

      saveBlob(blob, name)

      options.notify?.success?.("File berhasil diunduh")
    }
    catch (e: any) {
      options.notify?.error(
        e?.data?.detail
        ?? e?.message
        ?? translate("common.errors.download", "Failed to download file."),
      )
    }
    finally {
      loading.value = false
    }
  }

  /** Export data sesuai filter yang sedang aktif di tabel. */
  async function exportData() {
    await download(
      options.endpoint,
      options.filename ?? "export.csv",
      options.query?.(),
    )
  }

  /** Unduh template CSV kosong untuk fitur import. */
  async function downloadTemplate() {
    await download(
      options.templateEndpoint,
      "import-template.csv",
    )
  }

  return {
    loading,
    exportData,
    downloadTemplate,
  }
}
