

echo "Generate HR Master..."

# -----------------------------------------------------------------------------
# Personal References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/genders
pnpm meinova generate references/hr/religions
pnpm meinova generate references/hr/nationalities
pnpm meinova generate references/hr/marital-statuses
pnpm meinova generate references/hr/blood-types

# -----------------------------------------------------------------------------
# Education References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/educations
pnpm meinova generate references/hr/degrees
pnpm meinova generate references/hr/study-fields

# -----------------------------------------------------------------------------
# Employment References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/employment-types
pnpm meinova generate references/hr/employment-statuses
pnpm meinova generate references/hr/employment-groups
pnpm meinova generate references/hr/contract-types
pnpm meinova generate references/hr/probation-types
pnpm meinova generate references/hr/job-categories
pnpm meinova generate references/hr/job-families
pnpm meinova generate references/hr/job-levels
pnpm meinova generate references/hr/job-grades

# -----------------------------------------------------------------------------
# Attendance & Leave References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/shift-groups
pnpm meinova generate references/hr/shifts
pnpm meinova generate references/hr/work-schedules
pnpm meinova generate references/hr/working-calendars
pnpm meinova generate references/hr/holidays

pnpm meinova generate references/hr/leave-types
pnpm meinova generate references/hr/leave-reasons
pnpm meinova generate references/hr/attendance-statuses
pnpm meinova generate references/hr/overtime-types

# -----------------------------------------------------------------------------
# Skills & Qualification References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/skills
pnpm meinova generate references/hr/skill-levels
pnpm meinova generate references/hr/certificate-types
pnpm meinova generate references/hr/license-types
pnpm meinova generate references/hr/languages
pnpm meinova generate references/hr/language-proficiencies

# -----------------------------------------------------------------------------
# Family & Emergency References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/family-relationships
pnpm meinova generate references/hr/emergency-relationships

# -----------------------------------------------------------------------------
# Recruitment References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/recruitment-sources
pnpm meinova generate references/hr/candidate-statuses
pnpm meinova generate references/hr/interview-types
pnpm meinova generate references/hr/rejection-reasons

# -----------------------------------------------------------------------------
# Performance References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/kpi-categories
pnpm meinova generate references/hr/kpi-periods
pnpm meinova generate references/hr/kpi-weight-types
pnpm meinova generate references/hr/performance-ratings
pnpm meinova generate references/hr/performance-cycles
pnpm meinova generate references/hr/performance-templates

# -----------------------------------------------------------------------------
# Competency References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/competency-categories
pnpm meinova generate references/hr/competencies
pnpm meinova generate references/hr/competency-levels

# -----------------------------------------------------------------------------
# Employee Separation References
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/termination-reasons
pnpm meinova generate references/hr/exit-clearance-statuses

# -----------------------------------------------------------------------------
# Training
# -----------------------------------------------------------------------------
pnpm meinova generate references/hr/training-category
pnpm meinova generate references/hr/training-provider


echo "Done."