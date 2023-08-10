type Dates = {
  startDate: string;
  endDate: string;
};

type URLs = {
  procedureResults: {
    procedureDetails: (procedureResultId: string) => string;
    procedureStats: (facility: string) => string;
    verify: string;
    view: (procedureResultId: string | number) => string;
    notes: (procedureResultId: string) => string;
    download: (procedureResultId: string) => string;
    addNote: (procedureResultId: string) => string;
    workLog: (days: string) => string;
    datesRange: (dates: Dates) => string;
    downloadLog: (startDate: string, endDate: string) => string;
    submit: (procedureResultId: string) => string;
    addStep: (procedureResultId: string) => string;
  };
  measurementResults: {
    submit: (measurementResultId: string) => string;
    linkFiles: (measurementResultId: string) => string;
  };
  stepResults: {
    submit: (stepResult: string) => string;
    addMeasurement: (stepResultId: string) => string;
  };
  allLabels: string;
  notes: {
    noteDetails: (noteId: string) => string;
    comments: (noteId: string) => string;
    emailNote: (noteId: string | number) => string;
    markRead: (noteId: string) => string;
    linkFiles: (noteId: string) => string;
    submitComment: string;
    bulkUpdate: (noteId: string) => string;
    addNote: string;
    flags: string;
    tasks: string;
    supportTickets: string;
    closedFlags: string;
    closedTasks: string;
    closedSupportTickets: string;
    noteCounts: string;
  };
  noteTypes: {
    byGroup: (filter: string) => string;
  };
  labels: {
    all: string;
    submit: string;
  };
  dispositions: {
    all: string;
    units: string;
    notes: string;
    workOrderUnits: string;
    measurementResults: string;
    crates: string;
    workOrders: string;
    byName: (name: string) => string;
  };
  users: {
    submit: string;
    all: string;
    details: (userId: string) => string;
    edit: (userId: string) => string;
    active: string;
    lostPassword: (userId: string | null) => string;
    setPassword: (userId: string) => string;
    setGroups: (userId: string) => string;
    setAllowedTemplates: (userId: number) => string;
    myNotes: (closed: string | null) => string;
  };
  units: {
    all: string;
    unitDetails: (unitId: string) => string;
    linkFiles: (unitId: string) => string;
    magicLink: (unitId: string) => string;
    label: (unitId: string, token: string) => string;
    addNote: (unitId: string) => string;
    stressQueue: string;
    groupedHistory: (unitId: string) => string;
    notes: (unitId: string, type: number | null) => string;
    validAsset: (unitId: string) => string;
    bySerialNumber: (serialNumber: string | null) => string;
    byAsset: (assetId: number) => string;
    endOfLifeQueue: string;
    appendTestSequence: (unitId: string) => string;
  };
  projects: {
    submit: string;
    projectDetails: (projectId: string | null) => string;
    projectIntelligenceSummary: (projectId: string) => string;
    linkUnits: (projectId: string) => string;
    linkFiles: (projectId: string) => string;
    addNote: (projectId: string) => string;
    availableUnits: (projectId: string) => string;
    burndownGraph: (projectId: string) => string;
    allDownloads: string;
    selectedDownloads: (
      selectedIds: string | number | null,
      adjust_images: boolean | null,
      unitIds?: string | number,
      procedureIds?: string | number,
      tsdIds?: string | number
    ) => string;
    download: (projectId: string | number) => string;
    activeProjects: (archived: string | boolean) => string;
    myProjects: (archived: string | boolean) => string;
    notes: (projectId: string) => string;
    notesAndType: (projectId: string, type: string | number | null) => string;
    workOrders: (projectId: string) => string;
    actions: (projectId: string) => string;
    addAction: (projectId: string) => string;
  };
  plugins: {
    all: string;
    details: (pluginId: string | number) => string;
    testPlugin: (
      pluginId: string | number,
      serialize: boolean | null
    ) => string;
    runPlugin: (pluginId: string | number, serialize: boolean | null) => string;
  };
  files: {
    azureFiles: string;
    azureFileDetails: (fileId: string) => string;
  };
  auth: {
    signin: string;
    whoami: string;
    forgotPassword: string;
  };
  testResults: {
    all: string;
  };
  wetLeakageViewer: {
    all: string;
  };
  manageResults: {
    permissions: string;
    retestProcedure: string;
    review: string;
    rerunSoak: string;
    recordCompletion: string;
  };
  crates: {
    all: string;
    details: (crateId: string) => string;
    submit: string;
    linkFiles: (crateId: string) => string;
    notes: (crateId: string, type: string | number | null) => string;
    markEmpty: string;
    addNote: (crateId: string) => string;
  };
  workOrders: {
    submit: string;
    details: (workOrderId: string) => string;
    linkUnits: (workOrderId: string) => string;
    unlinkUnits: (workOrderId: string) => string;
    autoAssignUnits: (workOrderId: string) => string;
    assignUnits: (workOrderId: string | null) => string;
    intakeUnits: string;
    expectedUnitTypes: (workOrderId: string) => string;
    addTests: (workOrderId: string) => string;
    deleteTests: (workOrderId: string) => string;
    addAction: (workOrderId: string) => string;
  };
  expectedUnitTypes: {
    submit: string;
    details: (expectedUnitTypeId: string) => string;
  };
  locations: {
    all: string;
  };
  customers: {
    all: string;
    submit: string;
    details: (customerId: string) => string;
  };
  groups: {
    all: string;
    projectManagers: string;
    projects: string;
    users: string;
  };
  unitTypes: {
    all: string;
    submit: string;
    details: (unitTypeId: string) => string;
    linkFiles: (unitTypeId: string) => string;
  };
  testSequenceDefinitions: {
    all: string;
    mockTraveler: (testSequenceDefinitionId: string) => string;
  };
  moduleTechnologies: {
    all: string;
  };
  measurementTypes: {
    all: string;
  };
  reportTypes: {
    all: string;
  };
  unitTypeFamilies: {
    all: string;
  };
  assetTypes: {
    all: string;
    byName: (filter: string) => string;
  };
  availableDefects: {
    all: string;
  };
  actionResults: {
    all: string;
    details: (id: string) => string;
    completed: (id: string) => string;
    linkFiles: (id: string) => string;
    mark_complete: (id: string) => string;
    revoke: (id: string) => string;
    reports: string;
  };
  actionDefinitions: {
    all: string;
  };
  templates: {
    all: string;
    add: string;
    details: (id: string) => string;
  };
  fileFormats: {
    all: string;
  };
  userRegistrationStatus: {
    all: string;
  };
};

export const urls: URLs = {
  procedureResults: {
    procedureDetails: (procedureResultId) =>
      `procedure_results/${procedureResultId}/`,
    procedureStats: (facility) =>
        `procedure_results/procedure_stats/?facility=${facility}`,
    verify: "procedure_results/verify/",
    view: (procedureResultId) => `procedure_results/${procedureResultId}/view/`,
    notes: (procedureResultId) =>
      `procedure_results/${procedureResultId}/notes/`,
    download: (procedureResultId) =>
      `procedure_results/${procedureResultId}/download/`,
    addNote: (procedureResultId) =>
      `procedure_results/${procedureResultId}/add_note/`,
    workLog: (days) => `/procedure_results/worklog/?days=${days}`,
    datesRange: (dates) =>
      `procedure_results/worklog/?start_datetime=${dates.startDate}&end_datetime=${dates.endDate}`,
    downloadLog: (startDate, endDate) =>
      `procedure_results/worklog/?start_datetime=${startDate}&end_datetime=${endDate}&file=excel`,
    submit: (procedureResultId) =>
      `procedure_results/${procedureResultId}/submit/`,
    addStep: (procedureResultId) =>
      `procedure_results/${procedureResultId}/add_step/`,
  },
  measurementResults: {
    submit: (measurementResultId) =>
      `measurement_results/${measurementResultId}/submit/`,
    linkFiles: (measurementResultId) =>
      `measurement_results/${measurementResultId}/link_files/`,
  },
  stepResults: {
    submit: (stepResultId) => `step_results/${stepResultId}/submit/`,
    addMeasurement: (stepResultId) =>
      `step_results/${stepResultId}/add_measurement/`,
  },
  allLabels: "labels/?limit=-1",
  notes: {
    noteDetails: (noteId) => `notes/${noteId}/`,
    comments: (noteId) => `notes/${noteId}/get_children/`,
    emailNote: (noteId) => `notes/${noteId}/email_note/`,
    markRead: (noteId) => `notes/${noteId}/mark_read/`,
    linkFiles: (noteId) => `notes/${noteId}/link_files/`,
    submitComment: `notes/`,
    bulkUpdate: (noteId) => `notes/${noteId}/bulk_update/`,
    addNote: `notes/add_note/`,
    flags: "notes/flags/?limit=-1",
    tasks: "notes/tasks/?limit=-1",
    supportTickets: "notes/support_tickets/?limit=-1",
    closedFlags: "notes/closed_flags/?limit=-1",
    closedTasks: "notes/closed_tasks/?limit=-1",
    closedSupportTickets: "notes/closed_support_tickets/?limit=-1",
    noteCounts: "notes/dashboard_counts/",
  },
  noteTypes: {
    byGroup: (filter) => `/note_types/?groups__name=${filter}`,
  },
  labels: {
    all: "labels/?limit=-1",
    submit: "labels/",
  },
  dispositions: {
    all: "dispositions/?limit=-1",
    units: "units/dispositions/",
    notes: "notes/dispositions/",
    workOrderUnits: "work_orders/unit_dispositions/",
    measurementResults: "measurement_results/dispositions/",
    crates: "crates/dispositions/?limit=-1",
    workOrders: "work_orders/dispositions/?limit=-1 ",
    byName: (name) => `dispositions/?name=${name}`,
  },
  users: {
    submit: "users/",
    all: `users/?limit=-1`,
    details: (userId) => `users/${userId}/`,
    edit: (userId) => `users/${userId}/edit/`,
    active: "users/?is_active=true&limit=-1",
    lostPassword: (userId) => `users/${userId}/lost_password/`,
    setPassword: (userId) => `users/${userId}/set_password/`,
    setGroups: (userId) => `users/${userId}/set_groups/`,
    setAllowedTemplates: (userId) => `users/${userId}/set_allowed_templates/`,
    myNotes: (closed) => `users/my_notes/?closed=${closed}`,
  },
  units: {
    all: "units/?limit=-1",
    unitDetails: (unitId) => `units/${unitId}/`,
    linkFiles: (unitId) => `units/${unitId}/link_files/`,
    magicLink: (unitId) => `units/${unitId}/get_magic_link/`,
    label: (unitId, token) => `units/${unitId}/get_label/?token=${token}`,
    addNote: (unitId) => `units/${unitId}/add_note/`,
    stressQueue: "units/stress_queue/",
    groupedHistory: (unitId) => `units/${unitId}/grouped_history/`,
    notes: (unitId, type) => `units/${unitId}/notes/?type=${type}`,
    validAsset: (unitId) => `units/${unitId}/valid_asset/`,
    bySerialNumber: (serialNumber) => `units/?serial_number=${serialNumber}`,
    byAsset: (assetId) => `assets/${assetId}/units/`,
    endOfLifeQueue: "units/end_of_life/",
    appendTestSequence: (unitId) => `units/${unitId}/append_test_sequence/`,
  },
  projects: {
    submit: "projects/",
    projectDetails: (projectId) => `projects/${projectId}/`,
    projectIntelligenceSummary: (projectId) =>
      `projects/${projectId}/pi_summary_table/`,
    linkUnits: (projectId) => `projects/${projectId}/link_units/`,
    linkFiles: (projectId) => `projects/${projectId}/link_files/`,
    addNote: (projectId) => `projects/${projectId}/add_note/`,
    availableUnits: (projectId) => `projects/${projectId}/available_units/`,
    burndownGraph: (projectId) => `projects/${projectId}/burndown_graph/`,
    allDownloads: "projects/download/?limit=-1",
    selectedDownloads: (
      selectedIds,
      adjust_images,
      unitIds,
      procedureIds,
      tsdIds
    ) => {
      let finalString = `projects/download/?workorder_ids=${selectedIds}&adjust_images=${adjust_images}`;

      if (unitIds) finalString += `&unit_ids=${unitIds}`;
      if (procedureIds) finalString += `&procedure_ids=${procedureIds}`;
      if (tsdIds) finalString += `&test_sequence_definition_ids=${tsdIds}`;

      return finalString;
    },
    download: (projectId) => `projects/${projectId}/download_project/`,
    activeProjects: (archived) =>
      `projects/active_projects/?show_archived=${archived}`,
    myProjects: (archived) => `projects/my_projects/?show_archived=${archived}`,
    notes: (projectId) => `projects/${projectId}/notes/`,
    notesAndType: (projectId, type) =>
      `projects/${projectId}/notes/?type=${type}`,
    workOrders: (projectId) => `projects/${projectId}/work_orders/`,
    actions: (projectId) => `projects/${projectId}/actions/`,
    addAction: (projectId) => `projects/${projectId}/new_action/`,
  },
  plugins: {
    all: "plugins/?limit=-1",
    details: (pluginId) => `plugins/${pluginId}/`,
    testPlugin: (pluginId, serialize) =>
      `plugins/${pluginId}/test_plugin/?serialize=${serialize}`,
    runPlugin: (pluginId, serialize) =>
      `plugins/${pluginId}/run_plugin/?serialize=${serialize}`,
  },
  files: {
    azureFiles: `azure_files/`,
    azureFileDetails: (fileId) => `azure_files/${fileId}/`,
  },
  auth: {
    signin: "signin/",
    whoami: "whoami/",
    forgotPassword: "forgot_password/",
  },
  testResults: {
    all: "test_results/?limit=-1",
  },
  wetLeakageViewer: {
    all: "wet_leakage_viewer/",
  },
  manageResults: {
    permissions: "manage_results/",
    retestProcedure: `manage_results/retest_procedure/`,
    review: `manage_results/review/`,
    rerunSoak: `manage_results/rerun_soak/`,
    recordCompletion: "manage_results/record_completion/",
  },
  crates: {
    all: `crates/?limit=-1`,
    details: (crateId) => `crates/${crateId}/`,
    submit: "crates/",
    linkFiles: (crateId) => `crates/${crateId}/link_files/`,
    notes: (crateId, type) => `crates/${crateId}/notes/?type=${type}`,
    markEmpty: `crates/mark_empty/`,
    addNote: (crateId) => `crates/${crateId}/add_note/`,
  },
  workOrders: {
    submit: "work_orders/?limit=-1",
    details: (workOrderId) => `work_orders/${workOrderId}/`,
    linkUnits: (workOrderId) => `work_orders/${workOrderId}/link_units/`,
    unlinkUnits: (workOrderId) => `work_orders/${workOrderId}/unlink_units/`,
    autoAssignUnits: (workOrderId) =>
      `work_orders/${workOrderId}/autoassign_units/`,
    assignUnits: (workOrderId) => `work_orders/${workOrderId}/assign_units/`,
    intakeUnits: "work_orders/intake_units/",
    expectedUnitTypes: (workOrderId) =>
      `work_orders/${workOrderId}/expected_unit_types/`,
    addTests: (workOrderId) => `work_orders/${workOrderId}/add_tests/`,
    deleteTests: (workOrderId) => `work_orders/${workOrderId}/delete_tests/`,
    addAction: (workOrderId) => `work_orders/${workOrderId}/new_action/`,
  },
  expectedUnitTypes: {
    submit: "expected_unit_types/",
    details: (expectedUnitTypeId) =>
      `expected_unit_types/${expectedUnitTypeId}/`,
  },
  locations: {
    all: "locations/",
  },
  customers: {
    all: "customers/?limit=-1",
    submit: "customers/",
    details: (customerId) => `customers/${customerId}/`,
  },
  groups: {
    all: "groups/?limit=-1",
    projectManagers: "groups/?name=Project Managers&limit=-1",
    projects: "groups/?name=Projects&limit=-1",
    users: `groups/?group_type__name=Users&limit=-1`,
  },
  unitTypes: {
    all: "unit_types/?limit=-1",
    submit: "unit_types/",
    details: (unitTypeId) => `unit_types/${unitTypeId}/`,
    linkFiles: (unitTypeId) => `unit_types/${unitTypeId}/link_files/`,
  },
  testSequenceDefinitions: {
    all: "test_sequence_definitions/?limit=-1&disposition=16",
    mockTraveler: (testSequenceDefinitionId) =>
      `test_sequence_definitions/${testSequenceDefinitionId}/mock_traveler/`,
  },
  moduleTechnologies: {
    all: "module_technologies/?limit=-1",
  },
  measurementTypes: {
    all: "measurement_types/?limit=-1",
  },
  reportTypes: {
    all: "report_types/?limit=-1",
  },
  unitTypeFamilies: {
    all: "unit_type_families/?limit=-1",
  },
  assetTypes: {
    all: "asset_types/?limit=-1",
    byName: (filter) => `asset_types/?name=${filter}`,
  },
  availableDefects: {
    all: `available_defects/?limit=-1`,
  },
  actionResults: {
    all: `action_results/?limit=-1`,
    details: (actionResultId) => `action_results/${actionResultId}/`,
    completed: (actionResultId) =>
      `action_results/${actionResultId}/check_complete/`,
    linkFiles: (actionResultId) =>
      `action_results/${actionResultId}/link_files/`,
    mark_complete: (actionResultId) =>
      `action_results/${actionResultId}/mark_complete/`,
    revoke: (actionResultId) => `action_results/${actionResultId}/revoke/`,
    reports: "action_results/reports/",
  },
  actionDefinitions: {
    all: `action_definitions/`,
  },
  templates: {
    all: "templates/?limit=-1",
    add: "templates/",
    details: (id: string) => `templates/${id}/`,
  },
  fileFormats: {
    all: "file_formats/?limit=-1",
  },
  userRegistrationStatus: {
    all: "user_registration_statuses/?limit=-1",
  },
};
