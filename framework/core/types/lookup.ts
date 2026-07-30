export type LookupOption = {
  value: string | number
  label: string
  code?: string
  [key: string]: any
}

export type LookupResponse = {
  count?: number
  results?: LookupOption[]
}