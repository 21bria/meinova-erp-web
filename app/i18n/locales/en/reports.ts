/*
| Katalog modul Reports. Kuncinya `<namespace>.fields.<kolom>`, disusun
| `useDashboard` saat render; kolom = kode metrik backend, dan kodenya
| sendiri tidak pernah diterjemahkan.
*/
export default {
  hr: {
    'period-summary': {
      fields: {
        employee_number: 'Employee ID',
        employee: 'Employee',
        location: 'Location',
        scheduled: 'Scheduled',
        present: 'Present',
        absent: 'Absent',
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
