import { createForm, field } from "@framework"

export const stepsForm = createForm([
  field.lookup("definition", "Workflow", "/api/workflow/lookup/workflow-definitions/", {
      "labelKey": "workflow.steps.fields.definition",
      "required": true,
      "displayKey": "definition_name",
      "tab": "general",
      "order": 10
    }),

  field.number("sequence", "Step", {
      "labelKey": "workflow.steps.fields.sequence",
      "hint": "Dikosongkan = nomor bebas berikutnya.",
      "default": 1,
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Step Name", {
      "labelKey": "workflow.steps.fields.name",
      "required": true,
      "hint": "Judul kotak tanda tangan di formulir tercetak, mis. 'Approved By (Atasan Langsung)'.",
      "tab": "general",
      "order": 30
    }),

  field.textarea("description", "Description", {
      "labelKey": "workflow.steps.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "workflow.steps.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.select("approver_type", "Approver Type", {
      "labelKey": "workflow.steps.fields.approver_type",
      "required": true,
      "displayKey": "approver_type_label",
      "default": "manager",
      "multiple": false,
      "tab": "approver",
      "order": 110,
      "options": [
        {
          "label": "Direct Manager",
          "value": "manager"
        },
        {
          "label": "Role Holder",
          "value": "role"
        },
        {
          "label": "Specific User",
          "value": "user"
        },
        {
          "label": "Position Hierarchy",
          "value": "position"
        },
        {
          "label": "Department Head",
          "value": "department_head"
        }
      ]
    }),

  field.number("level", "Level", {
      "labelKey": "workflow.steps.fields.level",
      "visibleWhen": {
        "approver_type": [
          "manager",
          "position"
        ]
      },
      "hint": "Berapa tingkat naik untuk tipe berbasis hierarki. 1 = atasan langsung.",
      "default": 1,
      "tab": "approver",
      "order": 120
    }),

  field.lookup("approver_role", "Role", "/api/accounts/lookup/roles/", {
      "labelKey": "workflow.steps.fields.approver_role",
      "displayKey": "approver_role_name",
      "visibleWhen": {
        "approver_type": "role"
      },
      "hint": "Wajib diisi kalau tipenya Role Holder.",
      "tab": "approver",
      "order": 130
    }),

  field.select("approver_scope", "Role Scope", {
      "labelKey": "workflow.steps.fields.approver_scope",
      "displayKey": "approver_scope_label",
      "visibleWhen": {
        "approver_type": "role"
      },
      "hint": "Sejauh mana pemegang role dicari, dibandingkan dengan penempatan pegawai yang dokumennya diproses. Location untuk meja yang memang per site (KTT, Admin Site); Company untuk yang melayani lintas site (HRGA, HR Manager). Kolom yang dipilih harus terisi di penempatan pegawainya — kalau kosong, step ini tidak menemukan siapa pun.",
      "default": "company",
      "multiple": false,
      "tab": "approver",
      "order": 135,
      "options": [
        {
          "label": "Entire Tenant",
          "value": "tenant"
        },
        {
          "label": "Company",
          "value": "company"
        },
        {
          "label": "Branch",
          "value": "branch"
        },
        {
          "label": "Location",
          "value": "location"
        },
        {
          "label": "Division",
          "value": "division"
        },
        {
          "label": "Department",
          "value": "department"
        },
        {
          "label": "Section",
          "value": "section"
        }
      ]
    }),

  field.lookup("approver_user", "User", "/api/accounts/lookup/users/", {
      "labelKey": "workflow.steps.fields.approver_user",
      "displayKey": "approver_user_name",
      "visibleWhen": {
        "approver_type": "user"
      },
      "hint": "Wajib diisi kalau tipenya Specific User.",
      "tab": "approver",
      "order": 140
    }),

  field.lookup("approver_position", "Position", "/api/administration/organization/lookup/positions/", {
      "labelKey": "workflow.steps.fields.approver_position",
      "displayKey": "approver_position_name",
      "visibleWhen": {
        "approver_type": "position"
      },
      "hint": "Dikosongkan = berangkat dari jabatan pengaju sendiri, lalu naik sebanyak Level.",
      "tab": "approver",
      "order": 150
    }),

  field.lookup("fallback_role", "Fallback Role", "/api/accounts/lookup/roles/", {
      "labelKey": "workflow.steps.fields.fallback_role",
      "displayKey": "fallback_role_name",
      "hint": "Dipakai kalau penelusuran struktur organisasi tidak menemukan siapa pun. Kosong = step-nya gagal, kecuali Required dimatikan.",
      "tab": "approver",
      "order": 160
    }),

  field.select("approval_mode", "Approval Mode", {
      "labelKey": "workflow.steps.fields.approval_mode",
      "displayKey": "approval_mode_label",
      "hint": "Hanya berpengaruh kalau step ini menghasilkan lebih dari satu approver — praktisnya tipe Role Holder.",
      "default": "any",
      "multiple": false,
      "tab": "behavior",
      "order": 210,
      "options": [
        {
          "label": "Any Approver",
          "value": "any"
        },
        {
          "label": "All Approvers",
          "value": "all"
        }
      ]
    }),

  field.number("minimum_approvals", "Minimum Approvals", {
      "labelKey": "workflow.steps.fields.minimum_approvals",
      "visibleWhen": {
        "approval_mode": "any"
      },
      "hint": "Berapa persetujuan yang dibutuhkan pada mode Any Approver.",
      "default": 1,
      "tab": "behavior",
      "order": 220
    }),

  field.switch("is_required", "Required", {
      "labelKey": "workflow.steps.fields.is_required",
      "hint": "Dimatikan: approver yang tidak ketemu membuat step ini dilewati, bukan menggagalkan seluruh pengajuan.",
      "default": true,
      "tab": "behavior",
      "order": 230
    }),

  field.switch("can_reject", "Can Reject", {
      "labelKey": "workflow.steps.fields.can_reject",
      "hint": "Approver step ini boleh menolak dokumen.",
      "default": true,
      "tab": "behavior",
      "order": 240
    }),

  field.switch("can_return", "Can Return", {
      "labelKey": "workflow.steps.fields.can_return",
      "hint": "Approver boleh mengembalikan dokumen ke pengaju untuk diperbaiki, tanpa menolaknya.",
      "default": true,
      "tab": "behavior",
      "order": 250
    }),

  field.text("condition", "Condition", {
      "labelKey": "workflow.steps.fields.condition",
      "hint": "Kosong = step selalu jalan. Contoh: {\"field\": \"total_days\", \"op\": \"gte\", \"value\": 5} — step ini hanya jalan untuk cuti 5 hari ke atas.",
      "tab": "behavior",
      "order": 260
    }),
], {
  columns: 2,
})