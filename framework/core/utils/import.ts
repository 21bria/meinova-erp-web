export function getFileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? ""
}

export function isAllowedFile(filename: string, extensions: string[]) {
  return extensions.includes(getFileExtension(filename))
}