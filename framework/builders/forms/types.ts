export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "number"
  | "select"
  | "lookup"
  | "switch"
  | "checkbox"
  | "date"
  | "datetime"
  | "custom"

export type FormFieldOption = {
  label: string
  value: any
}

export type FormField = {
  key: string
  type: FormFieldType

  label?: string

  placeholder?: string

  rows?: number
  layout?: "normal" | "full"

  required?: boolean
  requiredOnCreate?: boolean

  disabled?: boolean
  readonly?: boolean
  hidden?: boolean

  options?: FormFieldOption[]
  multiple?: boolean
  endpoint?: string

  component?: any
  props?: Record<string, any>

  hint?: string
  error?: string

  visible?: boolean

  // --------------------------------------------------
  // Workspace
  // --------------------------------------------------

  tab?: string
  group?: string
  order?: number

  // --------------------------------------------------
  // Table / Filter
  // --------------------------------------------------

  table?: boolean
  filter?: boolean
  search?: boolean
  sortable?: boolean


 
  // --------------------------------------------------
  // Lookup
  // --------------------------------------------------

  dependsOn?: string | string[]

  lookupParams?: Record<
    string,
    string | number | boolean | null
  >
}