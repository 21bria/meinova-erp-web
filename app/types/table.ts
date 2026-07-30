export type FilterPlacement = "top" | "drawer"

export type FilterUI = {
  variant?: "compact" | "field"
}

export type FilterSchema =
  | {
      key: string
      label: string
      kind: "select"
      endpoint: string
      depends?: string[]
      queryMap?: Record<string, string> // key form -> nama query param
      multiple?: boolean
      placement?: FilterPlacement
      ui?: FilterUI
    }
  | {
      key: string
      label: string
      kind: "static-select"
      options: { value: any; label: string }[]
      multiple?: boolean
      placement?: FilterPlacement
      ui?: FilterUI
    }
  | {
      key: string
      label: string
      kind: "text"
      placeholder?: string
      placement?: FilterPlacement
      ui?: FilterUI
    }
  | {
      key: string
      label: string
      kind: "date"
      placement?: FilterPlacement
      ui?: FilterUI
    }
  | {
      key: string
      label: string
      kind: "daterange"
      startKey: string
      endKey: string
      placement?: FilterPlacement
      ui?: FilterUI
    }

export type MasterTableConfig = {
  id: string
  endpoint: string
  filters?: FilterSchema[]
  defaultQuery?: Record<string, any>
}