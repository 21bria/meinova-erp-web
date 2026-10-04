import { createForm, field } from "@framework"

export const employeesForm = createForm([
  field.switch("employment_type_requires_contract", "Contract Based", {
      "labelKey": "hr.employees.fields.employment_type_requires_contract",
      "readonly": true,
      "hidden": true,
      "default": false,
      "tab": "contract",
      "order": 1
    }),

  field.switch("employee_group_shift_applicable", "Shift Applicable", {
      "labelKey": "hr.employees.fields.employee_group_shift_applicable",
      "readonly": true,
      "hidden": true,
      "tab": "work_arrangement",
      "order": 1
    }),

  field.switch("employee_group_roster_applicable", "Roster Applicable", {
      "labelKey": "hr.employees.fields.employee_group_roster_applicable",
      "readonly": true,
      "hidden": true,
      "tab": "work_arrangement",
      "order": 2
    }),

  field.lookup("user", "User Account", "/api/accounts/lookup/users/", {
      "labelKey": "hr.employees.fields.user",
      "tab": "general",
      "order": 10
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.employees.fields.company",
      "required": true,
      "autofill": {
        "employee_number": "next_employee_number"
      },
      "displayKey": "company_name",
      "tab": "organization",
      "order": 10
    }),

  field.lookup("employment_status", "Employment Status", "/api/administration/references/hr/lookup/employment-statuses/", {
      "labelKey": "hr.employees.fields.employment_status",
      "required": true,
      "tab": "employment",
      "order": 10
    }),

  field.switch("auto_generate_employee_number", "Auto Generate Employee Number", {
      "labelKey": "hr.employees.fields.auto_generate_employee_number",
      "hint": "Nomor dibuat dari kode Company + tahun + urutan (mis. KW260001). Matikan kalau nomornya mau diketik sendiri. Hanya berlaku saat pegawai dibuat.",
      "modes": [
        "create"
      ],
      "default": true,
      "tab": "general",
      "order": 15
    }),

  field.text("employee_number", "Employee Number", {
      "labelKey": "hr.employees.fields.employee_number",
      "placeholder": "Terisi otomatis dari kode Company",
      "readonlyWhen": {
        "field": "auto_generate_employee_number",
        "op": "is_true"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.employees.fields.branch",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "organization",
      "order": 20
    }),

  field.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
      "labelKey": "hr.employees.fields.employment_type",
      "required": true,
      "autofill": {
        "employment_type_requires_contract": "requires_contract"
      },
      "tab": "employment",
      "order": 20
    }),

  field.text("nik", "NIK", {
      "labelKey": "hr.employees.fields.nik",
      "placeholder": "National identity number",
      "default": "",
      "tab": "general",
      "order": 30
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.employees.fields.location",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "tab": "organization",
      "order": 30
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "hr.employees.fields.employee_group",
      "autofill": {
        "employee_group_shift_applicable": "shift_applicable",
        "employee_group_roster_applicable": "roster_applicable"
      },
      "hint": "Klasifikasi pegawai — dan sumber Feature Applicability: proses HR mana yang berlaku untuknya. Diatur di master Employee Group, bukan di sini.",
      "tab": "employment",
      "order": 30
    }),

  field.text("passport_number", "Passport Number", {
      "labelKey": "hr.employees.fields.passport_number",
      "default": "",
      "tab": "general",
      "order": 40
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "labelKey": "hr.employees.fields.division",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location"
      },
      "tab": "organization",
      "order": 40
    }),

  field.date("employment_effective_date", "Employment Effective Date", {
      "labelKey": "hr.employees.fields.employment_effective_date",
      "tab": "employment",
      "order": 40
    }),

  field.text("tax_number", "NPWP", {
      "labelKey": "hr.employees.fields.tax_number",
      "default": "",
      "tab": "general",
      "order": 50
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "hr.employees.fields.department",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "division_id": "$division"
      },
      "tab": "organization",
      "order": 50
    }),

  field.lookup("contract_type", "Contract Type", "/api/administration/references/hr/lookup/contract-types/", {
      "labelKey": "hr.employees.fields.contract_type",
      "visibleWhen": {
        "field": "employment_type_requires_contract",
        "op": "is_true"
      },
      "hint": "Hanya untuk jenis kepegawaian berkontrak. Perpanjangan dan perubahan kontrak pegawai yang sudah ada lewat Employee Action.",
      "tab": "contract",
      "order": 50
    }),

  field.text("first_name", "First Name", {
      "labelKey": "hr.employees.fields.first_name",
      "required": true,
      "tab": "general",
      "order": 60
    }),

  field.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
      "labelKey": "hr.employees.fields.section",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "division_id": "$division",
        "department_id": "$department"
      },
      "tab": "organization",
      "order": 60
    }),

  field.lookup("probation_type", "Probation Type", "/api/administration/references/hr/lookup/probation-types/", {
      "labelKey": "hr.employees.fields.probation_type",
      "hint": "Kosongkan kalau pegawai ini tidak menjalani masa percobaan — tanggalnya ikut tersembunyi.",
      "tab": "contract",
      "order": 60
    }),

  field.lookup("position", "Position", "/api/administration/organization/lookup/positions/", {
      "labelKey": "hr.employees.fields.position",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "division_id": "$division",
        "department_id": "$department",
        "section_id": "$section"
      },
      "tab": "organization",
      "order": 70
    }),

  field.date("join_date", "Join Date", {
      "labelKey": "hr.employees.fields.join_date",
      "required": true,
      "tab": "employment",
      "order": 70
    }),

  field.text("job_location", "Job Location", {
      "labelKey": "hr.employees.fields.job_location",
      "placeholder": "mis. Jakarta / Gebe",
      "default": "",
      "tab": "employment",
      "order": 75
    }),

  field.lookup("point_of_hire", "Point of Hire", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "hr.employees.fields.point_of_hire",
      "displayKey": "point_of_hire_name",
      "hint": "Kota tempat pegawai direkrut. Ke sinilah tiket pulang ditanggung saat blok off, bukan ke alamat domisili.",
      "tab": "employment",
      "order": 76
    }),

  field.text("last_name", "Last Name", {
      "labelKey": "hr.employees.fields.last_name",
      "default": "",
      "tab": "general",
      "order": 80
    }),

  field.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
      "labelKey": "hr.employees.fields.job_level",
      "tab": "organization",
      "order": 80
    }),

  field.date("confirmation_date", "Confirmation Date", {
      "labelKey": "hr.employees.fields.confirmation_date",
      "tab": "employment",
      "order": 80
    }),

  field.lookup("job_grade", "Job Grade", "/api/administration/references/hr/lookup/job-grades/", {
      "labelKey": "hr.employees.fields.job_grade",
      "tab": "organization",
      "order": 90
    }),

  field.date("probation_start", "Probation Start", {
      "labelKey": "hr.employees.fields.probation_start",
      "visibleWhen": {
        "field": "probation_type",
        "op": "is_not_null"
      },
      "tab": "contract",
      "order": 90
    }),

  field.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
      "labelKey": "hr.employees.fields.gender",
      "tab": "general",
      "order": 100
    }),

  field.lookup("reports_to", "Reports To", "/api/hr/employees/lookup/", {
      "labelKey": "hr.employees.fields.reports_to",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "reports_to_name",
      "tab": "organization",
      "order": 100
    }),

  field.date("probation_end", "Probation End", {
      "labelKey": "hr.employees.fields.probation_end",
      "visibleWhen": {
        "field": "probation_type",
        "op": "is_not_null"
      },
      "tab": "contract",
      "order": 100
    }),

  field.text("payroll_group", "Payroll group", {
      "labelKey": "hr.employees.fields.payroll_group",
      "tab": "general"
    }),

  field.text("salary_grade", "Salary grade", {
      "labelKey": "hr.employees.fields.salary_grade",
      "tab": "general"
    }),

  field.text("salary_level", "Salary level", {
      "labelKey": "hr.employees.fields.salary_level",
      "tab": "general"
    }),

  field.text("currency", "Currency", {
      "labelKey": "hr.employees.fields.currency",
      "tab": "general"
    }),

  field.text("payment_method", "Payment method", {
      "labelKey": "hr.employees.fields.payment_method",
      "tab": "general"
    }),

  field.text("tax_status", "Tax status", {
      "labelKey": "hr.employees.fields.tax_status",
      "tab": "general"
    }),

  field.text("tax_number_payroll", "Tax number payroll", {
      "labelKey": "hr.employees.fields.tax_number_payroll",
      "tab": "general"
    }),

  field.text("bpjs_kesehatan_number", "Bpjs kesehatan number", {
      "labelKey": "hr.employees.fields.bpjs_kesehatan_number",
      "tab": "general"
    }),

  field.text("bpjs_ketenagakerjaan_number", "Bpjs ketenagakerjaan number", {
      "labelKey": "hr.employees.fields.bpjs_ketenagakerjaan_number",
      "tab": "general"
    }),

  field.text("overtime_eligible", "Overtime eligible", {
      "labelKey": "hr.employees.fields.overtime_eligible",
      "tab": "general"
    }),

  field.text("overtime_group", "Overtime group", {
      "labelKey": "hr.employees.fields.overtime_group",
      "tab": "general"
    }),

  field.text("basic_salary", "Basic salary", {
      "labelKey": "hr.employees.fields.basic_salary",
      "tab": "general"
    }),

  field.text("allowance_template", "Allowance template", {
      "labelKey": "hr.employees.fields.allowance_template",
      "tab": "general"
    }),

  field.text("deduction_template", "Deduction template", {
      "labelKey": "hr.employees.fields.deduction_template",
      "tab": "general"
    }),

  field.text("effective_from", "Effective from", {
      "labelKey": "hr.employees.fields.effective_from",
      "tab": "general"
    }),

  field.text("effective_to", "Effective to", {
      "labelKey": "hr.employees.fields.effective_to",
      "tab": "general"
    }),

  field.text("payroll_notes", "Payroll notes", {
      "labelKey": "hr.employees.fields.payroll_notes",
      "tab": "general"
    }),

  field.lookup("religion", "Religion", "/api/administration/references/hr/lookup/religions/", {
      "labelKey": "hr.employees.fields.religion",
      "tab": "general",
      "order": 110
    }),

  field.date("contract_start", "Contract Start", {
      "labelKey": "hr.employees.fields.contract_start",
      "visibleWhen": {
        "field": "employment_type_requires_contract",
        "op": "is_true"
      },
      "tab": "contract",
      "order": 110
    }),

  field.lookup("nationality", "Nationality", "/api/administration/references/hr/lookup/nationalities/", {
      "labelKey": "hr.employees.fields.nationality",
      "autofill": {
        "nationality_code": "code"
      },
      "tab": "general",
      "order": 120
    }),

  field.lookup("cost_center", "Cost Center", "/api/administration/organization/lookup/cost-centers/", {
      "labelKey": "hr.employees.fields.cost_center",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "organization",
      "order": 120
    }),

  field.date("contract_end", "Contract End", {
      "labelKey": "hr.employees.fields.contract_end",
      "visibleWhen": {
        "field": "employment_type_requires_contract",
        "op": "is_true"
      },
      "tab": "contract",
      "order": 120
    }),

  field.text("nationality_code", "Nationality Code", {
      "labelKey": "hr.employees.fields.nationality_code",
      "readonly": true,
      "hidden": true,
      "tab": "general",
      "order": 121
    }),

  field.lookup("roster_policy", "Roster Policy", "/api/administration/references/hr/lookup/roster-policies/", {
      "labelKey": "hr.employees.fields.roster_policy",
      "autofill": {
        "roster_policy_cycle_length": "cycle_length",
        "work_schedule": "work_schedule"
      },
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "displayKey": "roster_policy_name",
      "visibleWhen": {
        "not": {
          "field": "employee_group_roster_applicable",
          "op": "is_false"
        }
      },
      "hint": "Pola roster pegawai site (6:2, 8:2, …). Kosongkan untuk pegawai kantor — tanpa policy, jadwal roster tidak pernah dibuatkan.",
      "tab": "work_arrangement",
      "order": 126
    }),

  field.date("roster_cycle_start", "Current Cycle Start", {
      "labelKey": "hr.employees.fields.roster_cycle_start",
      "visibleWhen": {
        "field": "roster_policy",
        "op": "is_not_null"
      },
      "hint": "Titik jangkar siklus pegawai INI — boleh berbeda dari rekan satu policy. Artinya mengikuti Cycle Start Basis pada policy: hari pertama kerja, hari tiba di site, atau hari berangkat dari Point of Hire. Boleh tanggal lampau.",
      "tab": "work_arrangement",
      "order": 127
    }),

  field.lookup("roster_crew", "Roster Crew", "/api/administration/calendar/lookup/roster-crews/", {
      "labelKey": "hr.employees.fields.roster_crew",
      "autofill": {
        "work_schedule": "work_schedule"
      },
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "displayKey": "roster_crew_name",
      "visibleWhen": {
        "not": {
          "field": "employee_group_roster_applicable",
          "op": "is_false"
        }
      },
      "hint": "Gelombang rotasi pegawai site — ini yang menentukan pola kerjanya. Kosongkan untuk pegawai HO/kantor, lalu pilih Work Schedule sendiri.",
      "tab": "work_arrangement",
      "order": 128
    }),

  field.lookup("blood_type", "Blood Type", "/api/administration/references/hr/lookup/blood-types/", {
      "labelKey": "hr.employees.fields.blood_type",
      "tab": "general",
      "order": 130
    }),

  field.lookup("work_schedule", "Work Schedule", "/api/administration/references/hr/lookup/work-schedules/", {
      "labelKey": "hr.employees.fields.work_schedule",
      "displayKey": "work_schedule_name",
      "hint": "Pegawai HO/kantor: pilih pola non-roster, mis. Regular 5 Days. Pegawai site: terisi sendiri dari Roster Crew dan harus sama dengan pola milik crew itu.",
      "tab": "work_arrangement",
      "order": 130
    }),

  field.lookup("back_to_back_partner", "Back-to-Back Partner", "/api/hr/employees/lookup/", {
      "labelKey": "hr.employees.fields.back_to_back_partner",
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "displayKey": "back_to_back_partner_name",
      "visibleWhen": {
        "field": "roster_policy",
        "op": "is_not_null"
      },
      "hint": "Pegawai yang masuk saat orang ini off. Opsional — tidak pernah menghalangi jadwal disetujui, cuma dipakai sebagai pembanding di layar jadwal.",
      "tab": "work_arrangement",
      "order": 133
    }),

  field.lookup("marital_status", "Marital Status", "/api/administration/references/hr/lookup/marital-statuses/", {
      "labelKey": "hr.employees.fields.marital_status",
      "tab": "general",
      "order": 140
    }),

  field.date("organization_effective_date", "Effective Date", {
      "labelKey": "hr.employees.fields.organization_effective_date",
      "required": true,
      "tab": "organization",
      "order": 140
    }),

  field.lookup("working_calendar", "Working Calendar", "/api/administration/calendar/lookup/work-calendars/", {
      "labelKey": "hr.employees.fields.working_calendar",
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "tab": "work_arrangement",
      "order": 140
    }),

  field.text("birth_place", "Birth Place", {
      "labelKey": "hr.employees.fields.birth_place",
      "default": "",
      "tab": "general",
      "order": 150
    }),

  field.textarea("organization_notes", "Organization Notes", {
      "labelKey": "hr.employees.fields.organization_notes",
      "rows": 4,
      "layout": "full",
      "tab": "organization",
      "order": 150
    }),

  field.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
      "labelKey": "hr.employees.fields.shift",
      "visibleWhen": {
        "not": {
          "field": "employee_group_shift_applicable",
          "op": "is_false"
        }
      },
      "tab": "work_arrangement",
      "order": 150
    }),

  field.date("roster_start_override", "Roster Start Override", {
      "labelKey": "hr.employees.fields.roster_start_override",
      "hint": "Kosongkan untuk ikut tanggal mulai siklus milik crew. Isi hanya kalau swing pegawai ini digeser sendiri.",
      "tab": "work_arrangement",
      "order": 154
    }),

  field.number("travel_days_override", "Travel Days Override", {
      "labelKey": "hr.employees.fields.travel_days_override",
      "hint": "Hari perjalanan sekali jalan khusus pegawai ini. Kosongkan untuk ikut Roster Policy (site, Point of Hire).",
      "tab": "work_arrangement",
      "order": 156
    }),

  field.date("birth_date", "Birth Date", {
      "labelKey": "hr.employees.fields.birth_date",
      "tab": "general",
      "order": 160
    }),

  field.number("notice_period_days", "Notice Period (Days)", {
      "labelKey": "hr.employees.fields.notice_period_days",
      "tab": "employment",
      "order": 160
    }),

  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "labelKey": "hr.employees.fields.province",
      "dependsOn": [
        "nationality"
      ],
      "lookupParams": {
        "country__code": "$nationality_code"
      },
      "visibleWhen": {
        "field": "nationality_code",
        "op": "eq",
        "value": "ID"
      },
      "tab": "general",
      "order": 162
    }),

  field.lookup("city", "Kabupaten/Kota", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "hr.employees.fields.city",
      "dependsOn": [
        "province"
      ],
      "lookupParams": {
        "province_id": "$province"
      },
      "visibleWhen": {
        "field": "nationality_code",
        "op": "eq",
        "value": "ID"
      },
      "tab": "general",
      "order": 163
    }),

  field.lookup("district", "Kecamatan", "/api/administration/references/geography/lookup/districts/", {
      "labelKey": "hr.employees.fields.district",
      "dependsOn": [
        "city"
      ],
      "lookupParams": {
        "city_id": "$city"
      },
      "visibleWhen": {
        "field": "nationality_code",
        "op": "eq",
        "value": "ID"
      },
      "tab": "general",
      "order": 164
    }),

  field.lookup("village", "Kelurahan/Desa", "/api/administration/references/geography/lookup/villages/", {
      "labelKey": "hr.employees.fields.village",
      "dependsOn": [
        "district"
      ],
      "lookupParams": {
        "district_id": "$district"
      },
      "visibleWhen": {
        "field": "nationality_code",
        "op": "eq",
        "value": "ID"
      },
      "tab": "general",
      "order": 165
    }),

  field.textarea("address", "Address", {
      "labelKey": "hr.employees.fields.address",
      "placeholder": "Nama jalan, nomor, RT/RW...",
      "hint": "Alamat detail saja. Province sampai Kelurahan/Desa diisi di dropdown terpisah.",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 166
    }),

  field.email("personal_email", "Personal Email", {
      "labelKey": "hr.employees.fields.personal_email",
      "default": "",
      "tab": "general",
      "order": 170
    }),

  field.textarea("employment_notes", "Employment Notes", {
      "labelKey": "hr.employees.fields.employment_notes",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "employment",
      "order": 170
    }),

  field.email("work_email", "Work Email", {
      "labelKey": "hr.employees.fields.work_email",
      "default": "",
      "tab": "general",
      "order": 180
    }),

  field.text("phone", "Phone", {
      "labelKey": "hr.employees.fields.phone",
      "default": "",
      "tab": "general",
      "order": 190
    }),

  field.text("mobile", "Mobile", {
      "labelKey": "hr.employees.fields.mobile",
      "default": "",
      "tab": "general",
      "order": 200
    }),

  field.text("emergency_contact_name", "Emergency Contact Name", {
      "labelKey": "hr.employees.fields.emergency_contact_name",
      "default": "",
      "tab": "general",
      "order": 210
    }),

  field.text("emergency_contact_phone", "Emergency Contact Phone", {
      "labelKey": "hr.employees.fields.emergency_contact_phone",
      "default": "",
      "tab": "general",
      "order": 220
    }),

  field.file("avatar_file", "Photo", {
      "labelKey": "hr.employees.fields.avatar_file",
      "hint": "Foto pegawai. Diunggah lewat kerangka unggahan dengan kategori Avatar.",
      "multiple": false,
      "tab": "general",
      "order": 230,
      "widget": "image-upload",
      "accept": "image/*",
      "maxSizeMb": 5,
      "category": "avatar",
      "public": false,
      "preview": true,
      "download": true,
      "replace": true,
      "delete": true,
      "uploadEndpoint": "/api/uploads/",
      "uploadMode": "separate",
      "valueMode": "id",
      "detailField": "avatar_file_detail"
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.employees.fields.notes",
      "placeholder": "Write employee notes...",
      "default": "",
      "layout": "full",
      "tab": "general",
      "order": 240
    }),

  field.switch("is_active", "Active", {
      "labelKey": "hr.employees.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 3,
})