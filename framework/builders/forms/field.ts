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

  url(
    key: string,
    label = "URL",
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "url",
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

  richtext(
    key: string,
    label?: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "richtext",
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
    optionsOrExtra:
      | FormFieldOption[]
      | FieldExtra = {},
    extra: FieldExtra = {},
  ): FormField {
    const isOptionsArray =
      Array.isArray(optionsOrExtra)

    const resolvedOptions =
      isOptionsArray
        ? optionsOrExtra
        : optionsOrExtra.options ?? []

    const resolvedExtra =
      isOptionsArray
        ? extra
        : optionsOrExtra

    return {
      key,
      type: "select",
      label,
      ...resolvedExtra,
      options: resolvedOptions,
      multiple:
        resolvedExtra.multiple
        ?? false,
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

  time(
    key: string,
    label: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "time",
      label,
      ...extra,
    }
  },

  file(
    key: string,
    label = "Attachment",
    extra: FieldExtra = {},
  ): FormField {
    const uploadEndpoint =
      extra.uploadEndpoint
      ?? extra.upload_endpoint
      ?? "/api/uploads/"

    const uploadMode =
      extra.uploadMode
      ?? extra.upload_mode
      ?? "separate"

    const valueMode =
      extra.valueMode
      ?? extra.value_mode
      ?? "id"

    const detailField =
      extra.detailField
      ?? extra.detail_field
      ?? `${key}_detail`

    return {
      key,
      type: "file",
      label,

      widget:
        extra.widget
        ?? "upload",

      multiple:
        extra.multiple
        ?? false,

      category:
        extra.category
        ?? "attachment",

      public:
        extra.public
        ?? false,

      preview:
        extra.preview
        ?? true,

      download:
        extra.download
        ?? true,

      replace:
        extra.replace
        ?? true,

      delete:
        extra.delete
        ?? true,

      uploadEndpoint,
      uploadMode,
      valueMode,
      detailField,

      ...extra,
    }
  },

  image(
    key: string,
    label = "Image",
    extra: FieldExtra = {},
  ): FormField {
    return {
      ...field.file(
        key,
        label,
        {
          accept: "image/*",
          category: "image",
          widget: "image-upload",
          ...extra,
        },
      ),
      type: "file",
    }
  },

  /**
   * Peringatan konfigurasi dari backend (`widget: "warnings"`), mis.
   * `travel_document_warnings` Employee Group. Hanya tampilan — tidak
   * divalidasi, tidak menahan simpan. Selalu selebar form.
   */
  warnings(
    key: string,
    label?: string,
    extra: FieldExtra = {},
  ): FormField {
    return {
      key,
      type: "warnings",
      label,
      layout: "full",
      readonly: true,
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