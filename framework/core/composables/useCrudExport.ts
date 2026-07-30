type Options = {
  notify?: {
    info: (message: string) => void
    error: (message: string) => void
  }
}

export function useCrudExport(options: Options = {}) {
  async function exportData() {
    options.notify?.info("Export is not available yet")
  }

  return {
    exportData,
  }
}