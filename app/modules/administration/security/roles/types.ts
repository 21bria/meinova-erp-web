export type RolesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  permissions: number[]
}

export type RolesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  permissions: number[]
}