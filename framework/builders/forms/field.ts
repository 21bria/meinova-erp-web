import type {
  FormField,
  FormFieldOption,
} from "./types"

type FieldExtra = Omit<
  FormField,
  "key" | "type" | "label"
>

export const field = {
  text(
    key: string,
    label?: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "text",
      label,
      ...extra,
    }
  },

  email(
    key: string,
    label = "Email",
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "email",
      label,
      ...extra,
    }
  },

  password(
    key: string,
    label = "Password",
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "password",
      label,
      ...extra,
    }
  },

  textarea(
    key: string,
    label?: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "textarea",
      label,
      ...extra,
    }
  },

  number(
    key: string,
    label?: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "number",
      label,
      ...extra,
    }
  },

  select(
    key: string,
    label: string,
    options: FormFieldOption[],
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "select",
      label,
      options,
      ...extra,
    }
  },

  lookup(
    key: string,
    label: string,
    endpoint: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "lookup",
      label,
      endpoint,
      ...extra,
    }
  },

  switch(
    key: string,
    label: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "switch",
      label,
      ...extra,
    }
  },

  checkbox(
    key: string,
    label: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "checkbox",
      label,
      ...extra,
    }
  },

  date(
    key: string,
    label: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "date",
      label,
      ...extra,
    }
  },

  datetime(
    key: string,
    label: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "datetime",
      label,
      ...extra,
    }
  },

  custom(
    key: string,
    component: any,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "custom",
      component,
      ...extra,
    }
  },
}