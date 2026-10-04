export type UsersRow = {
  id: number
  password: string
  last_login: string
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  email: string
  language: string
  groups: number[]
  user_permissions: number[]
  roles: number[]
  full_name: string
  role_names: string
}

export type UsersPayload = {
  id?: number
  password: string
  username: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  email: string
  language: string
  groups: number[]
  user_permissions: number[]
  roles: number[]
}