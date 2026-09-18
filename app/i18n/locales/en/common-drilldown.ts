/*
| Dialog rincian (drill-down) laporan dashboard — `MDashboardTable`.
|
| Backend mengirim **kode** stabil (`source_code`, `detail_kind`,
| `aggregate.unit`, `row_unit`); kalimatnya tinggal di sini. Tidak ada
| kode yang diterjemahkan balik atau dibandingkan dengan teks ini.
*/
export default {
  viewDetails: 'View details',
  title: 'Details',
  intro: 'Source records behind this value.',
  loadError: 'Failed to load details',
  empty: 'No records for this value.',
  truncated: 'Only part of the records is shown.',
  openSource: 'Open {source}',

  columns: {
    date: 'Date',
    description: 'Description',
    reference: 'Reference',
    value: 'Value',
    scheduled_in: 'Scheduled Clock-in',
    actual_in: 'Actual Clock-in',
    scheduled_out: 'Scheduled Clock-out',
    actual_out: 'Actual Clock-out',
    late_duration: 'Late Duration',
    early_duration: 'Early Leave Duration',
    duration: 'Duration',
    worked_duration: 'Worked Duration',
    clock_in: 'Clock-in',
    clock_out: 'Clock-out',
    start: 'Start',
    end: 'End',
    overtime_type: 'Overtime Type',
    reason: 'Reason',
    leave_type: 'Leave Type',
    date_range: 'Leave Period',
    quantity: 'Days',
    document: 'Document No.',
    status: 'Status',
    source: 'Source',
  },

  sources: {
    attendance: 'Attendance',
    leave: 'Leave',
    overtime: 'Overtime',
    roster: 'Roster Schedule',
  },

  summary: {
    occurrence: '{count} occurrence',
    occurrences: '{count} occurrences',
    day: '{count} day',
    days: '{count} days',
    record: '{count} record',
    records: '{count} records',
    total: 'total {duration}',
    totalHours: 'total {duration} = {hours}h',
    source: 'source {source}',
    missingDuration: '{count} without recorded duration',
  },

  duration: {
    minutes: '{m}m',
    hours: '{h}h',
    hoursMinutes: '{h}h {m}m',
  },

  excused: '{duration} excused',
  noRecord: 'No attendance record',
} as const
