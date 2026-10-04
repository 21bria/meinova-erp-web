import { createForm, field } from "@framework"

export const candidateInterviewsForm = createForm([
  field.lookup("candidate", "Candidate", "/api/hr/lookup/candidates/", {
      "labelKey": "hr.candidate-interviews.fields.candidate",
      "required": true,
      "displayKey": "candidate_name",
      "tab": "general",
      "order": 10
    }),

  field.number("stage", "Stage", {
      "labelKey": "hr.candidate-interviews.fields.stage",
      "required": true,
      "hint": "Urutan tahap wawancara. Tidak dibatasi jumlahnya.",
      "default": 1,
      "tab": "general",
      "order": 20
    }),

  field.lookup("interview_type", "Interview Type", "/api/administration/references/hr/lookup/interview-types/", {
      "labelKey": "hr.candidate-interviews.fields.interview_type",
      "displayKey": "interview_type_name",
      "tab": "general",
      "order": 30
    }),

  field.datetime("scheduled_at", "Scheduled At", {
      "labelKey": "hr.candidate-interviews.fields.scheduled_at",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.lookup("interviewer", "Interviewer", "/api/hr/employees/lookup/", {
      "labelKey": "hr.candidate-interviews.fields.interviewer",
      "displayKey": "interviewer_name",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.candidate-interviews.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.select("result", "Result", {
      "labelKey": "hr.candidate-interviews.fields.result",
      "required": true,
      "displayKey": "result_label",
      "default": "scheduled",
      "multiple": false,
      "tab": "result",
      "order": 110,
      "options": [
        {
          "label": "Scheduled",
          "value": "scheduled"
        },
        {
          "label": "Passed",
          "value": "passed"
        },
        {
          "label": "Failed",
          "value": "failed"
        },
        {
          "label": "No Show",
          "value": "no_show"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.number("score", "Score", {
      "labelKey": "hr.candidate-interviews.fields.score",
      "tab": "result",
      "order": 120
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.candidate-interviews.fields.notes",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "result",
      "order": 130
    }),
], {
  columns: 2,
})