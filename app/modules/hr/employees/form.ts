import { createForm, field } from "@framework"

export const employeesForm = createForm([
  field.lookup("user", "User Account", "/api/accounts/lookup/users/", {
      "tab": "general",
      "order": 10
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "organization",
      "order": 10
    }),

  field.lookup("employment_status", "Employment Status", "/api/administration/references/hr/lookup/employment-statuses/", {
      "required": true,
      "tab": "employment",
      "order": 10
    }),

  field.lookup("payroll_group", "Payroll Group", "/api/payroll/payroll-groups/lookup/", {
      "required": true,
      "tab": "payroll",
      "order": 10
    }),

  field.text("employee_number", "Employee Number", {
      "required": true,
      "placeholder": "e.g. EMP-0001",
      "tab": "general",
      "order": 20
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "organization",
      "order": 20
    }),

  field.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
      "required": true,
      "tab": "employment",
      "order": 20
    }),

  field.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
      "tab": "payroll",
      "order": 20
    }),

  field.text("nik", "NIK", {
      "placeholder": "National identity number",
      "tab": "general",
      "order": 30
    }),

  field.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
      "dependsOn": "branch",
      "lookupParams": {
        "branch_id": "$branch"
      },
      "tab": "organization",
      "order": 30
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "tab": "employment",
      "order": 30
    }),

  field.lookup("salary_level", "Salary Level", "/api/payroll/salary-levels/lookup/", {
      "dependsOn": "salary_grade",
      "lookupParams": {
        "salary_grade_id": "$salary_grade"
      },
      "tab": "payroll",
      "order": 30
    }),

  field.text("passport_number", "Passport Number", {
      "tab": "general",
      "order": 40
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "dependsOn": "site",
      "lookupParams": {
        "site_id": "$site"
      },
      "tab": "organization",
      "order": 40
    }),

  field.date("employment_effective_date", "Employment Effective Date", {
      "tab": "employment",
      "order": 40
    }),

  field.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
      "required": true,
      "tab": "payroll",
      "order": 40
    }),

  field.text("tax_number", "NPWP", {
      "tab": "general",
      "order": 50
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "dependsOn": "division",
      "lookupParams": {
        "division_id": "$division"
      },
      "tab": "organization",
      "order": 50
    }),

  field.lookup("contract_type", "Contract Type", "/api/administration/references/hr/lookup/contract-types/", {
      "tab": "employment",
      "order": 50
    }),

  field.text("payment_method", "Payment Method", {
      "tab": "payroll",
      "order": 50
    }),

  field.text("first_name", "First Name", {
      "required": true,
      "tab": "general",
      "order": 60
    }),

  field.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
      "dependsOn": "department",
      "lookupParams": {
        "department_id": "$department"
      },
      "tab": "organization",
      "order": 60
    }),

  field.lookup("probation_type", "Probation Type", "/api/administration/references/hr/lookup/probation-types/", {
      "tab": "employment",
      "order": 60
    }),

  field.lookup("tax_status", "Tax Status", "/api/payroll/tax-statuses/lookup/", {
      "tab": "payroll",
      "order": 60
    }),

  field.lookup("position", "Position", "/api/administration/organization/lookup/positions/", {
      "dependsOn": "section",
      "lookupParams": {
        "section_id": "$section"
      },
      "tab": "organization",
      "order": 70
    }),

  field.date("join_date", "Join Date", {
      "required": true,
      "tab": "employment",
      "order": 70
    }),

  field.text("tax_number_payroll", "Tax Number", {
      "tab": "payroll",
      "order": 70
    }),

  field.text("last_name", "Last Name", {
      "tab": "general",
      "order": 80
    }),

  field.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
      "tab": "organization",
      "order": 80
    }),

  field.date("confirmation_date", "Confirmation Date", {
      "tab": "employment",
      "order": 80
    }),

  field.text("bpjs_kesehatan_number", "BPJS Kesehatan Number", {
      "tab": "payroll",
      "order": 80
    }),

  field.lookup("job_grade", "Job Grade", "/api/administration/references/hr/lookup/job-grades/", {
      "tab": "organization",
      "order": 90
    }),

  field.date("probation_start", "Probation Start", {
      "tab": "employment",
      "order": 90
    }),

  field.text("bpjs_ketenagakerjaan_number", "BPJS Ketenagakerjaan Number", {
      "tab": "payroll",
      "order": 90
    }),

  field.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
      "tab": "general",
      "order": 100
    }),

  field.lookup("reports_to", "Reports To", "/api/hr/lookup/employees/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "organization",
      "order": 100
    }),

  field.date("probation_end", "Probation End", {
      "tab": "employment",
      "order": 100
    }),

  field.switch("overtime_eligible", "Overtime Eligible", {
      "tab": "payroll",
      "order": 100
    }),

  field.lookup("religion", "Religion", "/api/administration/references/hr/lookup/religions/", {
      "tab": "general",
      "order": 110
    }),

  field.date("contract_start", "Contract Start", {
      "tab": "employment",
      "order": 110
    }),

  field.lookup("overtime_group", "Overtime Group", "/api/payroll/overtime-groups/lookup/", {
      "tab": "payroll",
      "order": 110
    }),

  field.lookup("nationality", "Nationality", "/api/administration/references/hr/lookup/nationalities/", {
      "tab": "general",
      "order": 120
    }),

  field.lookup("cost_center", "Cost Center", "/api/administration/organization/lookup/cost-centers/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "organization",
      "order": 120
    }),

  field.date("contract_end", "Contract End", {
      "tab": "employment",
      "order": 120
    }),

  field.date("effective_from", "Effective From", {
      "required": true,
      "tab": "payroll",
      "order": 120
    }),

  field.date("effective_to", "Effective To", {
      "tab": "payroll",
      "order": 125
    }),

  field.lookup("blood_type", "Blood Type", "/api/administration/references/hr/lookup/blood-types/", {
      "tab": "general",
      "order": 130
    }),

  field.lookup("work_schedule", "Work Schedule", "/api/administration/references/hr/lookup/work-schedules/", {
      "tab": "employment",
      "order": 130
    }),

  field.text("basic_salary", "Basic Salary", {
      "tab": "payroll",
      "order": 130
    }),

  field.lookup("project", "Project", "/api/projects/lookup/projects/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "organization",
      "order": 130
    }),

  field.lookup("marital_status", "Marital Status", "/api/administration/references/hr/lookup/marital-statuses/", {
      "tab": "general",
      "order": 140
    }),

  field.date("organization_effective_date", "Effective Date", {
      "required": true,
      "tab": "organization",
      "order": 140
    }),

  field.lookup("working_calendar", "Working Calendar", "/api/administration/calendar/lookup/work-calendars/", {
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company",
        "site_id": "$site"
      },
      "tab": "employment",
      "order": 140
    }),

  field.lookup("allowance_template", "Allowance Template", "/api/payroll/allowance-templates/lookup/", {
      "tab": "payroll",
      "order": 140
    }),

  field.text("birth_place", "Birth Place", {
      "tab": "general",
      "order": 150
    }),

  field.textarea("organization_notes", "Organization Notes", {
      "rows": 4,
      "layout": "full",
      "tab": "organization",
      "order": 150
    }),

  field.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
      "tab": "employment",
      "order": 150
    }),

  field.lookup("deduction_template", "Deduction Template", "/api/payroll/deduction-templates/lookup/", {
      "tab": "payroll",
      "order": 150
    }),

  field.date("birth_date", "Birth Date", {
      "tab": "general",
      "order": 160
    }),

  field.number("notice_period_days", "Notice Period (Days)", {
      "tab": "employment",
      "order": 160
    }),

  field.textarea("payroll_notes", "Payroll Notes", {
      "rows": 4,
      "layout": "full",
      "tab": "payroll",
      "order": 160
    }),

  field.email("personal_email", "Personal Email", {
      "tab": "general",
      "order": 170
    }),

  field.textarea("employment_notes", "Employment Notes", {
      "rows": 4,
      "layout": "full",
      "tab": "employment",
      "order": 170
    }),

  field.email("work_email", "Work Email", {
      "tab": "general",
      "order": 180
    }),

  field.text("phone", "Phone", {
      "tab": "general",
      "order": 190
    }),

  field.text("mobile", "Mobile", {
      "tab": "general",
      "order": 200
    }),

  field.text("emergency_contact_name", "Emergency Contact Name", {
      "tab": "general",
      "order": 210
    }),

  field.text("emergency_contact_phone", "Emergency Contact Phone", {
      "tab": "general",
      "order": 220
    }),

  field.text("avatar", "Avatar", {
      "tab": "general",
      "order": 230
    }),

  field.textarea("notes", "Notes", {
      "placeholder": "Write employee notes...",
      "layout": "full",
      "tab": "general",
      "order": 240
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 3,
})