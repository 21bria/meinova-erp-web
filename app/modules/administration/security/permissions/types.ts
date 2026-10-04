export type PermissionsRow = {
  id: number
  name: string
  content_type: number | null
  content_type_name?: string | null
  codename: string
  code: string
  module: string
  model: string
}

export type PermissionsPayload = {
  id?: number
  content_type: number | null
  codename: string
}