/*
| Katalog modul Reports. Kuncinya `<namespace>.fields.<kolom>`, disusun
| `useDashboard` saat render; kolom = kode metrik backend, dan kodenya
| sendiri tidak pernah diterjemahkan.
*/
export default {
  hr: {
    'period-summary': {
      description: {
        attendance_trend: 'Present, late, and absent per period unit. Leave, holidays, and off days are not counted as attendance opportunities.',
        leave_breakdown: 'Annual, Sick, Other Leave, and Unpaid are report groupings; the original leave type stays readable in the drilldown.',
        overtime_trend: 'Overtime hours per day category — scheduled, off, and holiday.',
        department_comparison: 'Present and absent per department.',
        employee_period_summary: 'One row per employee for the selected period and filters. Click a number to see its source records.',
      },
      fields: {
        employee_number: 'Employee ID',
        employee: 'Employee',
        location: 'Location',
        scheduled: 'Scheduled',
        present: 'Present',
        absent: 'Absent',
        business_trip: 'Business Trip',
        annual: 'Annual Leave',
        sick: 'Sick',
        other_leave: 'Other Leave',
        unpaid: 'Unpaid',
        field_break: 'Field Break',
        off_worked: 'Off Worked',
        holiday_worked: 'Holiday Worked',
        late: 'Late',
        early: 'Early',
        ot_regular: 'Regular OT',
        ot_off: 'Off OT',
        ot_holiday: 'Holiday OT',
        ot_total: 'Total OT',
      },
    },
  },
} as const
