# Meinova Framework Generator

**Version:** v1.0.0 (Planning)
**Status:** 🚧 In Development

---

# Overview

Meinova Generator adalah CLI (Command Line Interface) internal yang digunakan
untuk menghasilkan boilerplate module secara otomatis berdasarkan standar
Meinova Framework.

Generator ini bertujuan menghilangkan proses copy-paste ketika membuat
module baru sehingga developer hanya fokus pada business logic.

---

# Vision

Daripada membuat CRUD dari nol setiap kali membuat module baru,
cukup jalankan satu command.

Example

```bash
pnpm meinova make:crud employee
```

Generator akan menghasilkan:

```

employee/
├── EmployeeTable.vue
├── EmployeeDialog.vue
├── columns.ts
├── filters.ts
├── form.ts
└── table.ts

```

Semua file sudah menggunakan:

- MCrudTable
- MCrudToolbar
- MCrudFilters
- MFormBuilder
- MFormDialog
- useCrud()
- useCrudDialog()
- useCrudDelete()
- createColumns()
- createFilters()
- createForm()

---

# Philosophy

Framework harus mengerjakan pekerjaan berulang.

Developer hanya mendefinisikan:

- endpoint
- fields
- columns
- filters
- business logic

Semua UI dan CRUD flow dihasilkan oleh framework.

---

# CLI

Current

```bash
pnpm meinova make:crud employee
```

Future

```bash
meinova make:crud employee
```

---

# Planned Commands

## CRUD

```bash
meinova make:crud employee
meinova make:crud department
meinova make:crud role
meinova make:crud customer
```

---

## Page

```bash
meinova make:page dashboard
meinova make:page profile
```

---

## Wizard

```bash
meinova make:wizard onboarding
meinova make:wizard recruitment
```

---

## Lookup

```bash
meinova make:lookup employee
meinova make:lookup project
```

---

## Dashboard

```bash
meinova make:dashboard production
meinova make:dashboard inventory
```

---

## Report

```bash
meinova make:report stock
meinova make:report payroll
```

---

# Folder Structure

```

scripts/
└── meinova/
├── cli.mjs
│
├── generators/
│ ├── crud.mjs
│ ├── page.mjs
│ ├── dashboard.mjs
│ ├── wizard.mjs
│ └── report.mjs
│
├── utils/
│ ├── files.mjs
│ ├── strings.mjs
│ ├── logger.mjs
│ └── template.mjs
│
└── templates/
├── crud/
├── page/
├── dashboard/
├── wizard/
└── report/

```

---

# CRUD Template

Generator menghasilkan:

```

Employee/
├── EmployeeTable.vue
├── EmployeeDialog.vue
├── columns.ts
├── filters.ts
├── form.ts
└── table.ts

```

Template sudah menggunakan seluruh komponen framework terbaru.

---

# Long Term Goal

Meinova Generator akan menjadi internal development platform
untuk seluruh aplikasi Meinova.

Semua module ERP akan memiliki struktur yang konsisten.

Contoh:

```

Administration
HR
Payroll
Inventory
Finance
CRM
Mining
Safety
HSE
Company Portal

```

Semuanya menggunakan struktur yang sama.

---

# Future Vision

```

Developer

↓

meinova make:crud employee

↓

Meinova Generator

↓

Generate Module

↓

Ready To Develop

```

Developer tidak lagi membuat CRUD dari nol.

Framework menghasilkan seluruh boilerplate sesuai standar perusahaan.

---

# Target

- Konsisten
- Cepat
- Mudah dipelihara
- Reusable
- Scalable
- Enterprise Ready

---

# Current Status

✅ CRUD Framework
✅ Table Framework
✅ Filter Framework
✅ Form Framework
✅ Lookup Framework
🚧 Generator CLI
⬜ Dashboard Generator
⬜ Report Generator
⬜ Wizard Generator
⬜ Page Generator

---

Meinova ERP Framework
Build Once. Generate Everywhere.