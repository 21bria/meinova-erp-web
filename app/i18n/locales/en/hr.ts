export default {
  employee: {
    title: 'Employee',
    titlePlural: 'Employees',
    fields: {
      employee_no: 'Employee Number',
      name: 'Name',
      department: 'Department',
      section: 'Section',
      position: 'Position',
      company: 'Company',
      location: 'Location',
      join_date: 'Join Date',
      employment_type: 'Employment Type',
      cost_center: 'Cost Center',
    },
  },

  attendance: {
    title: 'Attendance',
    fields: {
      work_date: 'Work Date',
      check_in: 'Check In',
      check_out: 'Check Out',
      shift: 'Shift',
    },
  },

  leave: {
    title: 'Leave',
    titlePlural: 'Leave Requests',
    actions: {
      record: 'Record Leave',
      recorded: 'Leave recorded.',
      recordFailed: 'Leave could not be recorded.',
    },
    annual: 'Annual Leave',
    sick: 'Sick Leave',
    unpaid: 'Unpaid Leave',
    maternity: 'Maternity Leave',
    fields: {
      leave_type: 'Leave Type',
      start_date: 'Start Date',
      end_date: 'End Date',
      days: 'Days',
      balance: 'Balance',
      reason: 'Reason',
    },
  },

  calendar: {
    title: 'Work Calendar',
    holiday: 'Holiday',
    holidayPlural: 'Holidays',
  },

  shiftCalendar: {
    mySchedule: 'My Schedule',
    showMySchedule: 'Show My Schedule',
    employee: 'Employee',
  },

  roster: {
    title: 'Roster',
    adjustment: 'Roster Adjustment',
  },

  travel: {
    title: 'Travel Request',
  },

  visitor: {
    title: 'Visitor',
  },

  /*
  | Travel Request (TR-CLEANUP-2) — teks bantu tab, kunci
  | `hr.travel-requests.tabHints.<tab>` dari generator.
  */
  'travel-requests': {
    tabHints: {
      accommodation: 'Each stay belongs to a trip leg. Adding a row here also adds a leg — complete or correct it in Travel Arrangement. To remove a stay, clear its fields and save; the leg stays.',
    },
  },

  /*
  | Business Trip (BT-5) — kunci yang dipancarkan generator untuk modul
  | `hr/business-trips` dan `hr/business-trip-legs`, plus tab detail.
  */
  'business-trips': {
    title: 'Business Trip',
    titlePlural: 'Business Trips',
    placeholder: {
      search: 'Search document no., employee, destination…',
    },
    saveFirst: {
      assignment: "Save the Business Trip first — the employee's assignment is captured when it is saved.",
      travel: 'Save the Business Trip first to add travel and accommodation details.',
      approval: 'Save the Business Trip first to see its approval and history.',
    },
    tabs: {
      general: 'General',
      trip: 'Trip Information',
      attachments: 'Attachment',
      assignment: 'Assignment',
      travel: 'Travel & Accommodation',
      approval: 'Approval / History',
    },
    fields: {
      document_number: 'Document No.',
      employee: 'Employee',
      request_date: 'Request Date',
      status: 'Status',
      requester: 'Requester',
      purpose_category: 'Purpose',
      purpose: 'Purpose Detail',
      destination_type: 'Destination Type',
      destination_location: 'Destination Location',
      destination_city: 'Destination City',
      destination_country: 'Destination Country',
      destination_detail: 'Destination Detail',
      destination_summary: 'Destination',
      origin_location: 'Origin',
      departure_datetime: 'Planned Departure',
      return_datetime: 'Planned Return',
      actual_departure_datetime: 'Actual Departure',
      actual_return_datetime: 'Actual Return',
      supersedes: 'Replaces / Extends',
      supersede_type: 'Link Type',
      notes: 'Notes',
      attachment: 'Attachment',
      company: 'Company',
      branch: 'Branch',
      location: 'Work Location',
      division: 'Division',
      department: 'Department',
      section: 'Section',
      position: 'Position',
      cost_center: 'Cost Center',
      cancellation_reason: 'Cancellation Reason',
      is_active: 'Active',
      submitted_at: 'Submitted',
      approved_at: 'Approved',
      rejected_at: 'Rejected',
      completed_at: 'Completed',
      cancelled_at: 'Cancelled',
      departed_at: 'Departed',
      assignment: 'Assignment',
      travel: 'Travel & Accommodation',
      approval: 'Approval / History',
    },
    actions: {
      submit: {
        label: 'Submit for Approval',
        confirm: {
          title: 'Submit this business trip?',
          description: 'The document goes to the approval flow and cannot be edited until a decision is made.',
        },
      },
      approve: {
        label: 'Approve',
      },
      reject: {
        label: 'Reject',
        fields: {
          notes: 'Reason',
        },
      },
      return: {
        label: 'Return for Revision',
        fields: {
          notes: 'Reason',
        },
      },
      withdraw: {
        label: 'Withdraw',
      },
      depart: {
        label: 'Mark Departed',
      },
      complete: {
        label: 'Complete Trip',
        fields: {
          actual_return_datetime: 'Actual Return',
        },
      },
      cancel: {
        label: 'Cancel Trip',
        fields: {
          cancellation_reason: 'Cancellation Reason',
        },
      },
    },
    assignment: {
      hint: 'Filled automatically from the employee\'s placement and frozen on submit. It cannot be edited here.',
    },
    legs: {
      description: 'Ordered itinerary: outbound, intermediate and return legs, with transport and accommodation.',
      empty: 'No travel legs yet.',
      locked: 'Legs can only be changed while the business trip is still editable (Draft or Rejected).',
    },
    lifecycle: {
      title: 'Trip Progress',
      extensionHint: 'Returning later than planned is an extension: it needs its own approved business trip. Complete only accepts a return on or before the planned return.',
    },
    cancellation: {
      title: 'Cancelled',
    },
    links: {
      title: 'Related Business Trips',
      supersedes: {
        replacement: 'Replaces',
        extension: 'Extends',
      },
      supersededBy: {
        replacement: 'Replaced by',
        extension: 'Extended by',
      },
    },
    approval: {
      title: 'Approval',
      notSubmitted: 'Not submitted yet. The approval trail appears after Submit.',
      waitingFor: 'Waiting for {step} ({approver})',
    },
    timeline: {
      title: 'History',
    },
  },

  'business-trip-legs': {
    fields: {
      trip: 'Business Trip',
      direction: 'Direction',
      sequence: 'Seq.',
      travel_start_date: 'Travel Date',
      travel_end_date: 'Arrival Date',
      origin: 'From',
      destination: 'To',
      transport_mode: 'Transport',
      transport_detail: 'Transport Detail',
      ticket_number: 'Ticket No.',
      accommodation_needed: 'Accommodation Needed',
      accommodation_type: 'Accommodation Type',
      accommodation_name: 'Accommodation',
      check_in_date: 'Check-in',
      check_out_date: 'Check-out',
      notes: 'Notes',
      is_active: 'Active',
    },
  },
} as const
