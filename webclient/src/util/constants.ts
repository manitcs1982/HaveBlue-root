export interface TesterUnits {
  [index: string]: string;
}

export const WET_LEAKAGE_TEST_UNITS: TesterUnits = {
  "Insulation Resistance": "MΩ·m²",
  "Test Voltage": "V",
  "Leakage Current": "mA",
  "Current Trip Setpoint": "mA",
  "Water Temperature": "°C",
};

export const DIODE_TEST_UNITS: TesterUnits = {
  "Forward Voltage": "V",
  "Reverse Voltage": "V",
};

export const EL_IMAGE_REVIEW_TEST_UNITS: TesterUnits = {
  "Exposure Count": "",
  ISO: "",
  Aperture: "",
  "EL Image (grayscale)": "",
  "EL Image (raw)": "",
  "Injection Current": "",
  "Exposure Time": "",
};
