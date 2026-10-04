export default {
  workspace: {
    title: 'My Workspace',
    subtitle: 'Here is what your day looks like.',
    detailHint: 'Looking for your full record? Open My Profile.',
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good evening',
    },
  },

  profile: {
    title: 'My Profile',
    readOnlyHint:
      'This page is read-only. Contact HR if anything needs correcting.',
  },

  /*
  | Duration units, **neutral to the card using them**.
  |
  | Read by `durationText()`, shared by the Overtime card on `/me` and
  | the Working Hours card and table column on `/me/attendance`. These
  | keys used to live under `cards.overtime`, where one wording fix to
  | overtime would quietly change how work hours are written.
  */
  duration: {
    hours: '{hours} hours',
    hoursMinutes: '{hours} hours {minutes} minutes',
    minutes: '{minutes} minutes',
  },

  attendance: {
    title: 'My Attendance',
    subtitle: 'A summary of your attendance and working hours.',

    range: {
      label: 'Period',
      previous: 'Previous period',
      next: 'Next period',
      pick: 'Pick dates',
      apply: 'Apply',
      max: 'Up to {days} days per period.',
      tooLong: 'The range is limited to {days} days. Narrow the dates.',
    },

    presets: {
      last7: '7 Days',
      last14: '14 Days',
      last30: '30 Days',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      custom: 'Custom',
    },

    summary: {
      title: 'Attendance Summary',
      workDays: 'Work Days',
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      businessTrip: 'Business Trip',
      leave: 'Leave / Permit',
      workedHours: 'Working Hours',
      overtime: 'Overtime',
      notApplicable: 'Not applicable',
      notApplicableHint: 'This process does not apply to you.',
      days: '{count} days',
    },

    chart: {
      title: 'Period Summary',
      legend: 'Colours follow each day\'s status within the period.',
      empty: 'There is nothing to summarise for this period yet.',
    },

    outcome: {
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      leave: 'Leave / Permit',
      business_trip: 'Business Trip',
      extra: 'Worked Off Schedule',
      off: 'Not Scheduled',
    },

    history: {
      title: 'Attendance History',
      empty: 'No attendance recorded for this period.',
      emptyHint: 'Try a different period.',
      columns: {
        date: 'Date',
        shift: 'Shift',
        status: 'Status',
        source: 'Source',
        checkIn: 'In',
        checkOut: 'Out',
        worked: 'Worked',
        late: 'Late',
        overtime: 'Overtime',
      },
      minutes: '{minutes}m',
      noTime: '—',
    },

    pagination: {
      perPage: '{count} / page',
      summary: '{from}–{to} of {count}',
      previous: 'Previous',
      next: 'Next',
    },
  },

  punch: {
    title: 'Check In',
    subtitle: 'Record your attendance: location, selfie, then submit.',
    viewAttendance: 'View Attendance',
    notEnabled: 'Check-in from Self Service is not enabled for your account.',
    trialNotice: 'GPS attendance trial — location and selfie are validated, but attendance is not recorded.',
    step: {
      location: '1. Location',
      selfie: '2. Selfie',
      submit: '3. Submit',
    },
    getLocation: 'Get my location',
    refreshLocation: 'Get location again',
    locating: 'Getting location…',
    acquired: 'Location acquired',
    notAcquired: 'Location not acquired yet',
    accuracy: 'Accuracy ±{value} m',
    lowAccuracy: 'Accuracy is worse than the allowed {limit} m. Move to an open area and try again.',
    selfieHint: 'Take a selfie with the front camera.',
    selfieTake: 'Take selfie',
    selfieRetake: 'Retake selfie',
    selfieReady: 'Selfie ready',
    checkIn: 'Check in',
    checkOut: 'Check out',
    sending: 'Sending…',
    errors: {
      insecure_context: 'Location only works on a secure (HTTPS) address. Open this page via https:// and try again.',
      unsupported: 'This browser cannot provide location.',
      permission_denied: 'Location permission was denied. Allow location for this site in your browser settings, then try again.',
      position_unavailable: 'Your location is unavailable. Turn on GPS/Location Services and try again.',
      timeout: 'Getting your location took too long. Try again, preferably outdoors.',
      upload: 'The selfie could not be uploaded. Try again.',
      submit: 'The check-in could not be sent. Try again.',
    },
    result: {
      heading: {
        trial: 'Trial result — attendance not recorded',
        success: 'Attendance recorded',
        warning: 'Recorded for HR review',
        error: 'Not accepted',
      },
      location: 'GPS',
      geofence: 'Work area',
      distance: '{distance} m from the work area centre (radius {radius} m)',
      selfie: 'Selfie',
      selfieStored: 'Stored as evidence',
      selfieMissing: 'Not sent',
      biometric: 'Face verification',
      biometricUnavailable: 'Not active in this trial',
      attendance: 'Attendance',
      attendanceNotRecorded: 'Not recorded (trial)',
      attendanceRecorded: 'Recorded',
    },
    values: {
      pass: 'OK',
      low_accuracy: 'Accuracy too low',
      unavailable: 'Unavailable',
      inside: 'Inside',
      outside: 'Outside',
      no_geofence: 'No work area configured',
      no_work_location: 'No work location',
      not_run: 'Not checked',
      not_configured: 'Not configured',
      error: 'Error',
    },
  },

  sections: {
    today: 'Today',
    myServices: 'My Services',
    latestPayslip: 'Latest Payslip',
    quickActions: 'Quick Actions',
    workInfo: 'Work Information',
    personal: 'Personal Information',
    contact: 'Contact & Address',
    employment: 'Employment',
    organization: 'Organization',
    emergency: 'Emergency Contact',
    emergencyHint: 'Who we reach if something happens to you at work.',
  },

  cards: {
    profile: {
      title: 'My Profile',
      description: 'Your personal and employment details.',
    },

    schedule: {
      title: 'Today\'s Schedule',
      empty: 'No schedule for today',
      noShift: 'No shift scheduled',
    },

    attendance: {
      title: 'Attendance',
      empty: 'No attendance record for today yet',
      checkIn: 'In {time}',
      checkOut: 'Out {time}',
      noCheckOut: 'Not checked out',
      late: '{minutes} minutes late',
    },

    requests: {
      title: 'Tasks & Requests',
      empty: 'Nothing waiting on you',
      waiting: '{count} pending',
      needsAction: '{count} need action',
    },

    leave: {
      title: 'Leave',
      empty: 'No leave balance recorded yet',
      days: '{days} days left',
    },

    permission: {
      title: 'Permission',
      empty: 'No permission request yet',
      latest: 'Latest request',
      pending: '{count} awaiting decision',
    },

    overtime: {
      title: 'Overtime',
      empty: 'No overtime this month',
      thisMonth: 'This month',
    },

    payslip: {
      title: 'Latest Payslip',
      empty: 'No payslip yet',
      issued: 'issued {date}',
    },
  },

  /*
  | The two code groups that have no home in the shared catalogue.
  |
  | Attendance statuses (`late`, `present`, …) and document statuses
  | (`approved`, `in_review`, …) are deliberately NOT here: both are
  | already complete in `common.status.*` for both languages and are read
  | by every HR table through `codeLabel()`. Copying them here would give
  | "Late" two sources of wording that must stay in agreement — and one
  | of them would fall behind.
  |
  | What remains below is only what genuinely has no counterpart there.
  */
  rosterState: {
    work: 'On Site',
    field_break: 'Field Break',
    travel_out: 'Travel Out',
    travel_in: 'Travel In',
    off: 'Off',
    holiday: 'Holiday',
    recovery: 'Recovery',
    unplanned: 'Unplanned',
    not_applicable: 'Not Applicable',
  },

  permissionType: {
    late_arrival: 'Late Arrival',
    early_leave: 'Early Leave',
    temporary_out: 'Temporary Out',
    full_day: 'Full Day Permission',
  },

  status: {
    active: 'Active',
    inactive: 'Inactive',
  },

  /*
  | Button labels, **keyed to the `code` the backend sends**.
  |
  | The backend decides which buttons are worth showing and where they
  | lead; this catalogue only supplies the words. A button whose code has
  | no translation shows the code itself — which looks wrong immediately,
  | rather than silently rendering blank.
  */
  actions: {
    viewProfile: 'View Profile',
    retry: 'Try again',

    profile: 'My Profile',
    check_in: 'Check In',
    schedule: 'View Schedule',
    attendance: 'View Attendance',
    approvals: 'Needs Action',
    submissions: 'My Requests',
    leave_request: 'Request Leave',
    permission_request: 'Request Permission',
    overtime_request: 'Request Overtime',
    payslip: 'View Payslip',
  },

  requests: {
    employee: 'Employee',
    personalHint: 'This request is submitted for yourself. To submit on behalf of someone else, use the HR module.',
    submit: 'Submit Request',
    submitting: 'Submitting…',
    cancel: 'Cancel',
    submitted: 'Request submitted for approval.',
    failed: 'The request could not be submitted.',
  },

  states: {
    unavailable: 'Profile unavailable',
    notLinked:
      'Your account is not linked to an employee record yet. Please contact HR.',
    inactive:
      'Your employee record is inactive, so Self Service is unavailable. Contact HR if this is a mistake.',
    notAuthenticated: 'Your session has ended. Please sign in again.',
    genericError: 'We could not load your profile. Please try again.',
  },

  fields: {
    gender: 'Gender',
    birthPlace: 'Place of Birth',
    birthDate: 'Date of Birth',
    maritalStatus: 'Marital Status',
    nationality: 'Nationality',
    bloodType: 'Blood Type',
    religion: 'Religion',

    personalEmail: 'Personal Email',
    workEmail: 'Work Email',
    phone: 'Phone',
    mobile: 'Mobile',
    address: 'Address',

    employmentStatus: 'Employment Status',
    employmentType: 'Employment Type',
    joinDate: 'Join Date',
    effectiveDate: 'Effective Date',
    confirmationDate: 'Confirmation Date',
    jobLocation: 'Job Location',

    company: 'Company',
    branch: 'Branch',
    location: 'Location',
    division: 'Division',
    department: 'Department',
    section: 'Section',
    position: 'Position',
    jobLevel: 'Job Level',
    jobGrade: 'Job Grade',
    costCenter: 'Cost Center',
    supervisor: 'Supervisor',

    emergencyName: 'Contact Name',
    emergencyPhone: 'Contact Phone',
  },
} as const
