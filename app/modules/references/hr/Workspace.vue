<script setup lang="ts">
import {
  computed,
  ref,
  type Component,
} from "vue"

// -----------------------------------------------------------------------------
// Personal References
// -----------------------------------------------------------------------------

import Gender from "./genders/page.vue"
import Religion from "./religions/page.vue"
import Nationality from "./nationalities/page.vue"
import MaritalStatus from "./marital-statuses/page.vue"
import BloodType from "./blood-types/page.vue"

// -----------------------------------------------------------------------------
// Education References
// -----------------------------------------------------------------------------

import Education from "./educations/page.vue"
import Degree from "./degrees/page.vue"
import StudyField from "./study-fields/page.vue"

// -----------------------------------------------------------------------------
// Employment References
// -----------------------------------------------------------------------------

import EmploymentType from "./employment-types/page.vue"
import EmploymentStatus from "./employment-statuses/page.vue"
import EmployeeGroup from "./employment-groups/page.vue"
import ContractType from "./contract-types/page.vue"
import ProbationType from "./probation-types/page.vue"
import JobCategory from "./job-categories/page.vue"
import JobFamily from "./job-families/page.vue"
import JobLevel from "./job-levels/page.vue"
import Grade from "./grades/page.vue"

// -----------------------------------------------------------------------------
// Attendance and Leave References
// -----------------------------------------------------------------------------

import ShiftGroup from "./shift-groups/page.vue"
import LeaveType from "./leave-types/page.vue"
import LeaveReason from "./leave-reasons/page.vue"
import AttendanceStatus from "./attendance-statuses/page.vue"
import OvertimeType from "./overtime-types/page.vue"

// -----------------------------------------------------------------------------
// Skills and Qualification References
// -----------------------------------------------------------------------------

import Skill from "./skills/page.vue"
import SkillLevel from "./skill-levels/page.vue"
import CertificateType from "./certificate-types/page.vue"
import LicenseType from "./license-types/page.vue"
import Language from "./languages/page.vue"
import LanguageProficiency from "./language-proficiencies/page.vue"

// -----------------------------------------------------------------------------
// Family and Emergency References
// -----------------------------------------------------------------------------

import FamilyRelationship from "./family-relationships/page.vue"
import EmergencyRelationship from "./emergency-relationships/page.vue"

// -----------------------------------------------------------------------------
// Recruitment References
// -----------------------------------------------------------------------------

import RecruitmentSource from "./recruitment-sources/page.vue"
import CandidateStatus from "./candidate-statuses/page.vue"
import InterviewType from "./interview-types/page.vue"
import RejectionReason from "./rejection-reasons/page.vue"

// -----------------------------------------------------------------------------
// Performance References
// -----------------------------------------------------------------------------

import KPICategory from "./kpi-categories/page.vue"
import KPIPeriod from "./kpi-periods/page.vue"
import KPIWeightType from "./kpi-weight-types/page.vue"
import PerformanceRating from "./performance-ratings/page.vue"
import PerformanceCycle from "./performance-cycles/page.vue"
import PerformanceTemplate from "./performance-templates/page.vue"

// -----------------------------------------------------------------------------
// Competency References
// -----------------------------------------------------------------------------

import CompetencyCategory from "./competency-categories/page.vue"
import Competency from "./competencies/page.vue"
import CompetencyLevel from "./competency-levels/page.vue"

// -----------------------------------------------------------------------------
// Employee Separation References
// -----------------------------------------------------------------------------

import TerminationReason from "./termination-reasons/page.vue"
import ExitClearanceStatus from "./exit-clearance-statuses/page.vue"

// -----------------------------------------------------------------------------
// Training
// -----------------------------------------------------------------------------

import TrainingCategory from "./training-category/page.vue"
import TrainingProvider from "./training-provider/page.vue"

type ReferenceItem = {
  value: string
  label: string
  component: Component
}

type ReferenceGroup = {
  value: string
  label: string
  items: ReferenceItem[]
}

const groups: ReferenceGroup[] = [
  {
    value: "personal",
    label: "Personal",
    items: [
      {
        value: "genders",
        label: "Gender",
        component: Gender,
      },
      {
        value: "religions",
        label: "Religion",
        component: Religion,
      },
      {
        value: "nationalities",
        label: "Nationality",
        component: Nationality,
      },
      {
        value: "marital-statuses",
        label: "Marital Status",
        component: MaritalStatus,
      },
      {
        value: "blood-types",
        label: "Blood Type",
        component: BloodType,
      },
    ],
  },
  {
    value: "education",
    label: "Education",
    items: [
      {
        value: "educations",
        label: "Education",
        component: Education,
      },
      {
        value: "degrees",
        label: "Degree",
        component: Degree,
      },
      {
        value: "study-fields",
        label: "Study Field",
        component: StudyField,
      },
    ],
  },
  {
    value: "employment",
    label: "Employment",
    items: [
      {
        value: "employment-types",
        label: "Employment Type",
        component: EmploymentType,
      },
      {
        value: "employment-statuses",
        label: "Employment Status",
        component: EmploymentStatus,
      },
      {
        value: "employee-groups",
        label: "Employee Group",
        component: EmployeeGroup,
      },
      {
        value: "contract-types",
        label: "Contract Type",
        component: ContractType,
      },
      {
        value: "probation-types",
        label: "Probation Type",
        component: ProbationType,
      },
      {
        value: "job-categories",
        label: "Job Category",
        component: JobCategory,
      },
      {
        value: "job-families",
        label: "Job Family",
        component: JobFamily,
      },
      {
        value: "job-levels",
        label: "Job Level",
        component: JobLevel,
      },
      {
        value: "grades",
        label: "Grade",
        component: Grade,
      },
    ],
  },
  {
    value: "attendance-leave",
    label: "Attendance & Leave",
    items: [
      {
        value: "shift-groups",
        label: "Shift Group",
        component: ShiftGroup,
      },
      {
        value: "leave-types",
        label: "Leave Type",
        component: LeaveType,
      },
      {
        value: "leave-reasons",
        label: "Leave Reason",
        component: LeaveReason,
      },
      {
        value: "attendance-statuses",
        label: "Attendance Status",
        component: AttendanceStatus,
      },
      {
        value: "overtime-types",
        label: "Overtime Type",
        component: OvertimeType,
      },
    ],
  },
  {
    value: "skills-qualification",
    label: "Skills & Qualification",
    items: [
      {
        value: "skills",
        label: "Skill",
        component: Skill,
      },
      {
        value: "skill-levels",
        label: "Skill Level",
        component: SkillLevel,
      },
      {
        value: "certificate-types",
        label: "Certificate Type",
        component: CertificateType,
      },
      {
        value: "license-types",
        label: "License Type",
        component: LicenseType,
      },
      {
        value: "languages",
        label: "Language",
        component: Language,
      },
      {
        value: "language-proficiencies",
        label: "Language Proficiency",
        component: LanguageProficiency,
      },
    ],
  },
  {
    value: "family-emergency",
    label: "Family & Emergency",
    items: [
      {
        value: "family-relationships",
        label: "Family Relationship",
        component: FamilyRelationship,
      },
      {
        value: "emergency-relationships",
        label: "Emergency Relationship",
        component: EmergencyRelationship,
      },
    ],
  },
  {
    value: "recruitment",
    label: "Recruitment",
    items: [
      {
        value: "recruitment-sources",
        label: "Recruitment Source",
        component: RecruitmentSource,
      },
      {
        value: "candidate-statuses",
        label: "Candidate Status",
        component: CandidateStatus,
      },
      {
        value: "interview-types",
        label: "Interview Type",
        component: InterviewType,
      },
      {
        value: "rejection-reasons",
        label: "Rejection Reason",
        component: RejectionReason,
      },
    ],
  },
  {
    value: "performance",
    label: "Performance",
    items: [
      {
        value: "kpi-categories",
        label: "KPI Category",
        component: KPICategory,
      },
      {
        value: "kpi-periods",
        label: "KPI Period",
        component: KPIPeriod,
      },
      {
        value: "kpi-weight-types",
        label: "KPI Weight Type",
        component: KPIWeightType,
      },
      {
        value: "performance-ratings",
        label: "Performance Rating",
        component: PerformanceRating,
      },
      {
        value: "performance-cycles",
        label: "Performance Cycle",
        component: PerformanceCycle,
      },
      {
        value: "performance-templates",
        label: "Performance Template",
        component: PerformanceTemplate,
      },
    ],
  },
  {
    value: "competency",
    label: "Competency",
    items: [
      {
        value: "competency-categories",
        label: "Competency Category",
        component: CompetencyCategory,
      },
      {
        value: "competencies",
        label: "Competency",
        component: Competency,
      },
      {
        value: "competency-levels",
        label: "Competency Level",
        component: CompetencyLevel,
      },
    ],
  },
  {
    value: "employee-separation",
    label: "Employee Separation",
    items: [
      {
        value: "termination-reasons",
        label: "Termination Reason",
        component: TerminationReason,
      },
      {
        value: "exit-clearance-statuses",
        label: "Exit Clearance Status",
        component: ExitClearanceStatus,
      },
    ],
  },
  {
    value: "employee-training",
    label: "Employee Training",
    items: [
      {
        value: "training-category",
        label: "Training Category",
        component: TrainingCategory,
      },
      {
        value: "training-provider",
        label: "Training Provider",
        component: TrainingProvider,
      },
    ],
  },
]

const firstGroup = groups[0]!

const activeGroup = ref<ReferenceGroup["value"]>(
  firstGroup.value,
)

const activeTab = ref(
  firstGroup.items[0]?.value ?? "",
)

const currentGroup = computed<ReferenceGroup>(() => {
  return (
    groups.find(group => group.value === activeGroup.value)
    ?? firstGroup
  )
})

const currentItems = computed<ReferenceItem[]>(() => {
  return currentGroup.value.items
})

const currentItem = computed<ReferenceItem | null>(() => {
  return (
    currentItems.value.find(item => item.value === activeTab.value)
    ?? currentItems.value[0]
    ?? null
  )
})

function selectGroup(value: ReferenceGroup["value"]) {
  activeGroup.value = value

  const group = groups.find(item => item.value === value)

  activeTab.value = group?.items[0]?.value ?? ""
}
</script>

<template>
  <main class="mx-auto max-w-screen-2xl px-0 py-0">
    <section class="mb-6 flex flex-col gap-1">
      <h1 class="text-2xl font-normal tracking-tight">
        HR References
      </h1>

      <p class="max-w-3xl text-muted-foreground">
        Manage reference data used across Employee, Attendance,
        Recruitment, Performance, Competency, and other HR modules.
      </p>
    </section>

    <div class="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside class="space-y-1 py-1">
        <button
          v-for="group in groups"
          :key="group.value"
          type="button"
          class="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition hover:bg-muted/70"
          :class="
            activeGroup === group.value
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground'
          "
          @click="selectGroup(group.value)"
        >
          {{ group.label }}
        </button>
      </aside>

      <section class="min-w-0">
        <Tabs
          v-if="currentItems.length"
          v-model="activeTab"
          class="w-full"
        >
          <div class="mb-6 overflow-x-auto border-b">
            <TabsList
              class="inline-flex h-auto w-fit justify-start bg-transparent p-0"
            >
              <TabsTrigger
                v-for="tab in currentItems"
                :key="tab.value"
                :value="tab.value"
                class="shrink-0 rounded-none border-b-2 border-transparent px-5 py-3 text-sm font-medium whitespace-nowrap text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>
          </div>

          <component
            v-if="currentItem"
            :is="currentItem.component"
          />
        </Tabs>

        <div
          v-else
          class="rounded-xl border border-dashed p-8 text-sm text-muted-foreground"
        >
          Reference pages for {{ currentGroup.label }} are not generated yet.
        </div>
      </section>
    </div>
  </main>
</template>