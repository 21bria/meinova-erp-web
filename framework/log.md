CRUD standar lewat framework Meinova.

Fungsinya:

MCrudTable      = wrapper table standar ERP
useCrud         = ambil data, pagination, search, sorting
useCrudDialog   = create/edit dialog logic
useCrudDelete   = delete single row
useCrudBulkDelete = delete banyak data
useCrudExport   = export logic
MCrudToolbar    = toolbar search/add/import/export

Kelebihannya:

1. Code jauh lebih pendek
2. Semua modul tampil konsisten
3. Bug cukup diperbaiki di satu tempat
4. Tambah modul baru jadi cepat
5. Import/export/filter bisa standar semua
6. Cocok untuk ERP besar karena tidak copy-paste logic

Contoh nanti bikin modul baru Warehouse cukup:

warehouse/
├── columns.ts
├── filters.ts
├── table.ts
└── WarehouseDialog.vue

Tidak perlu tulis ulang:

pagination
search
sorting
loading
delete
bulk delete
refresh
submit

Jadi framework ini membuat mesin CRUD internal Meinova. 
Modul seperti Company, Branch, User, Role, Bank, Password Policy, API Keys, Department, Position nanti tinggal “colok” ke framework.


Forms :
Fungsinya supaya semua form di ERP konsisten dan tidak copy-paste field terus.

truktur contoh:

framework/forms/
├── components/
│   ├── MForm.vue
│   ├── MFormField.vue
│   ├── MInputField.vue
│   ├── MTextareaField.vue
│   ├── MCheckboxField.vue
│   ├── MDateField.vue
│   ├── MLookupField.vue
│   └── MSection.vue
│
├── composables/
│   ├── useForm.ts
│   └── useFormErrors.ts
│
└── types.ts

Kegunaannya:

MForm            = wrapper form standar
MFormField       = label + error + help text
MLookupField     = lookup select standar
MDateField       = date picker standar
useFormErrors    = mapping error dari DRF
MSection         = group field seperti "General", "Contact", "Address"

Contoh nanti dialog Company tidak perlu tulis ulang error:

<MInputField
  v-model="local.code"
  label="Company Code"
  error-key="code"
  :errors="errors"
/>

Kelebihannya:

1. Semua form rapi dan konsisten
2. Error DRF otomatis tampil
3. Label, help text, required mark seragam
4. Layout form lebih cepat dibuat
5. Dialog Company/User/Role/Employee nanti jauh lebih pendek

Jadi urut framework Meinova:

crud/        = table + CRUD logic
forms/       = form + validation UI
lookup/      = select/search data relasi
table/       = table utilities
dialog/      = dialog wrapper
charts/      = chart standar
permissions/ = helper cek akses