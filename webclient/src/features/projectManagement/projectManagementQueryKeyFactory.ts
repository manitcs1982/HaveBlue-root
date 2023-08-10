export const customerKeys = {
  all: ["customers"] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: any) => [...customerKeys.details(), id] as const,
};

export const groupKeys = {
  all: ["groups"] as const,
  projectManagers: () => [...groupKeys.all, "projectManagers"] as const,
  projects: () => [...groupKeys.all, "projects"] as const,
  groupType: (groupType: number) =>
    [...groupKeys.all, "groupType", groupType] as const,
};

export const testSequenceDefinitionsKeys = {
  all: ["testSequenceDefinitions"] as const,
};

export const projectKeys = {
  all: ["projects"] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: any) => [...projectKeys.details(), id] as const,
  availableUnits: (id: any) => [...projectKeys.detail(id), "availableUnits"],
  workOrders: (id: any) => [...projectKeys.detail(id), "workOrders"],
  actions: (id: any) => [...projectKeys.detail(id), "actions"],
};

export const workOrderKeys = {
  all: ["workOrders"] as const,
  details: () => [...workOrderKeys.all, "detail"] as const,
  detail: (id: any) => [...workOrderKeys.details(), id] as const,
  assignUnits: (id: any) => [...workOrderKeys.detail(id), "assignUnits"],
};

export const unitTypeKeys = {
  all: ["unitTypes"] as const,
  details: () => [...unitTypeKeys.all, "detail"] as const,
  detail: (id: any) => [...unitTypeKeys.details(), id] as const,
};

export const unitTypeFamiliesKeys = {
  all: ["unitTypeFamilies"] as const,
};

export const moduleTechologiesKeys = {
  all: ["moduleTechnologies"] as const,
};

export const measurementTypesKeys = {
  all: ["measurementTypes"] as const,
};

export const reportTypesKeys = {
  all: ["reportTypes"] as const,
};

export const pluginKeys = {
  all: ["plugins"] as const,
  details: () => [...pluginKeys.all, "detail"] as const,
  detail: (id: number) => [...pluginKeys.details(), id] as const,
  test: (id: number) => [...pluginKeys.all, "test_plugin", id] as const,
};

export const procedureDefinitionKeys = {
  all: ["procedureDefinitions"] as const,
};

export const actionDefinitionKeys = {
  all: ["actionDefinitions"] as const,
  details: () => [...actionDefinitionKeys.all, "detail"] as const,
  detail: (id: string) => [...actionDefinitionKeys.details(), id] as const,
};
