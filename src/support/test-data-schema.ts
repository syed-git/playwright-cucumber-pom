/**
 * Test data schema template with all expected keys.
 * Use this to generate test-data.json with defaults for unset keys.
 */
export const TEST_DATA_SCHEMA = {
  effectiveDate: "",
  numberOfInsured: "1",
  numberOfDrivers: "1",
  numberOfVehicles: "1",
  Insured: {
    NamedInsured1: {
      // Mandatory fields for NamedInsured
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      isPrimaryInsured: true,
    },
  },
  Drivers: {
    Driver1: {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      licenseNumber: "",
    },
  },
  Vehicles: {
    Vehicle1: {
      vin: "",
      make: "",
      model: "",
      year: "",
      ownership: "",
    },
  },
  Coverages: {
    bodilyInjuryLiability: "50,000/100,000",
    propertyDamageLiability: "50,000",
    collision: "250",
  },
};

/**
 * Fields that are mandatory for Insured objects (must always be present).
 */
const INSURED_MANDATORY_FIELDS = new Set(["firstName", "lastName", "gender", "dateOfBirth", "isPrimaryInsured"]);

/**
 * Fields that are optional for Insured objects (only include if user provides them).
 */
const INSURED_OPTIONAL_FIELDS = new Set(["email", "phone", "address", "city", "state", "zip"]);

/**
 * Fields that are mandatory for Driver objects (must always be present).
 */
const DRIVER_MANDATORY_FIELDS = new Set(["firstName", "lastName", "gender", "dateOfBirth", "licenseNumber"]);

/**
 * Fields that are optional for Driver objects (only include if user provides them).
 */
const DRIVER_OPTIONAL_FIELDS = new Set(["email", "phone", "address", "city", "state", "zip"]);

/**
 * Fields that are mandatory for Vehicle objects (must always be present).
 */
const VEHICLE_MANDATORY_FIELDS = new Set(["year", "make", "model", "vin", "ownership"]);

/**
 * Fields that are mandatory for Coverages (must always be present).
 */
const COVERAGE_MANDATORY_FIELDS = new Set(["bodilyInjuryLiability", "propertyDamageLiability", "collision"]);

/**
 * Generate random value based on key name and depth.
 */
export function generateRandomValue(key: string): string {
  const keyLower = key.toLowerCase();

  // Special case: effectiveDate should be current date in MM-DD-YYYY format
  if (/effectivedate$/.test(keyLower)) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = String(today.getFullYear());
    return `${yyyy}-${mm}-${dd}`;
  }

  // Count fields (numberOfXXX) should not be randomly generated - use schema defaults
  if (/^numberof/.test(keyLower)) {
    return "1";
  }

  // License number should be 10 digits
  if (/license/.test(keyLower)) {
    return String(Math.floor(Math.random() * 9000000000) + 1000000000); // Ensures 10 digits
  }

  // VIN: 15 alphanumeric uppercase starting with "VIN"
  if (/^vin/.test(keyLower)) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let vin = "VIN";
    for (let i = 0; i < 12; i++) {
      vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
  }

  // Ownership: random from 3 options
  if (/ownership/.test(keyLower)) {
    const options = ["Owned", "Leased", "Rented"];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (/^(id)/.test(keyLower)) {
    return String(Math.floor(Math.random() * 100000));
  }
  if (/name|first|last/.test(keyLower)) {
    const names = ["John", "Jane", "Michael", "Sarah", "Robert", "Emily"];
    return names[Math.floor(Math.random() * names.length)];
  }
  if (/gender|sex/.test(keyLower)) {
    return Math.random() > 0.5 ? "Male" : "Female";
  }
  if (/date|birth/.test(keyLower)) {
    const year = 1960 + Math.floor(Math.random() * 50);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (/make|model|brand/.test(keyLower)) {
    const makes = ["Toyota", "Honda", "Ford", "BMW", "Tesla"];
    return makes[Math.floor(Math.random() * makes.length)];
  }
  if (/year/.test(keyLower)) {
    return String(2015 + Math.floor(Math.random() * 10));
  }

  // Default: random 5-letter string
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

/**
 * Deep merge user data with schema, filling missing keys with generated values.
 * Also dynamically expands Insured, Drivers, Vehicles based on count fields.
 */
export function mergeWithDefaults(userData: Record<string, any>, schema: Record<string, any> = TEST_DATA_SCHEMA): Record<string, any> {
  function merge(userObj: any, schemaObj: any, isInsured: boolean = false): any {
    if (typeof schemaObj !== "object" || schemaObj === null) {
      return userObj ?? generateRandomValue("");
    }

    const result: any = {};
    for (const key of Object.keys(schemaObj)) {
      if (typeof schemaObj[key] === "object" && schemaObj[key] !== null && key !== "NamedInsured1" && key !== "Coverages") {
        // For Drivers and Vehicles, do normal merge
        result[key] = merge(userObj?.[key] ?? {}, schemaObj[key], false);
      } else if (key === "Insured") {
        // Skip Insured here - will be handled specially later
        result[key] = { ...schemaObj[key] };
      } else if (key === "Coverages") {
        // Skip Coverages here - will be handled specially later
        result[key] = { ...schemaObj[key] };
      } else {
        result[key] = userObj?.[key] ?? generateRandomValue(key);
      }
    }
    return result;
  }

  let merged = merge(userData, schema, false);

  // Add any user-provided top-level keys that are not in the schema
  for (const key of Object.keys(userData)) {
    if (!(key in merged) && key !== "Insured" && key !== "Drivers" && key !== "Vehicles" && key !== "Coverages") {
      merged[key] = userData[key];
    }
  }

  // Validate and sanitize count fields (limit to reasonable range 1-10)
  const numInsured = Math.min(10, Math.max(1, parseInt(merged.numberOfInsured || "1", 10)));
  const numDrivers = Math.min(10, Math.max(1, parseInt(merged.numberOfDrivers || "1", 10)));
  const numVehicles = Math.min(10, Math.max(1, parseInt(merged.numberOfVehicles || "1", 10)));

  merged.numberOfInsured = String(numInsured);
  merged.numberOfDrivers = String(numDrivers);
  merged.numberOfVehicles = String(numVehicles);

  // Dynamically expand Insured based on numberOfInsured
  // Use raw user data, not pre-merged data
  if (merged.Insured) {
    const userInsured = userData?.Insured || {};
    merged.Insured = {};
    for (let i = 1; i <= numInsured; i++) {
      const key = `NamedInsured${i}`;
      const userInsuredData = userInsured[key] || {}; // Raw user data
      merged.Insured[key] = generateInsuredObject(i, userInsuredData);
    }
  }

  // Dynamically expand Drivers based on numberOfDrivers
  if (merged.Drivers) {
    const userDrivers = userData?.Drivers || {};
    merged.Drivers = {};
    for (let i = 1; i <= numDrivers; i++) {
      const key = `Driver${i}`;
      const userDriverData = userDrivers[key] || {}; // Raw user data
      merged.Drivers[key] = generateDriverObject(userDriverData);
    }
  }

  // Dynamically expand Vehicles based on numberOfVehicles
  if (merged.Vehicles) {
    const userVehicles = userData?.Vehicles || {};
    merged.Vehicles = {};
    for (let i = 1; i <= numVehicles; i++) {
      const key = `Vehicle${i}`;
      const userVehicleData = userVehicles[key] || {}; // Raw user data
      merged.Vehicles[key] = generateVehicleObject(userVehicleData);
    }
  }

  // Process Coverages with mandatory and optional fields
  if (merged.Coverages || userData?.Coverages) {
    const userCoverageData = userData?.Coverages || {};
    merged.Coverages = generateCoverageObject(userCoverageData);
  }

  return merged;
}

/**
 * Generate a random Insured object.
 * @param index The index of the insured (1, 2, 3, etc.)
 * @param userProvidedData User-provided data for this insured object
 */
function generateInsuredObject(index: number, userProvidedData?: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {
    // Mandatory fields - always generate/use
    firstName: userProvidedData?.firstName || generateRandomValue("firstName"),
    lastName: userProvidedData?.lastName || generateRandomValue("lastName"),
    gender: userProvidedData?.gender || generateRandomValue("gender"),
    dateOfBirth: userProvidedData?.dateOfBirth || generateRandomValue("dateOfBirth"),
    // isPrimaryInsured only true for NamedInsured1
    isPrimaryInsured: index === 1,
  };

  // Add any other user-provided fields that are not mandatory
  if (userProvidedData) {
    for (const key of Object.keys(userProvidedData)) {
      if (!INSURED_MANDATORY_FIELDS.has(key) && userProvidedData[key] !== undefined && userProvidedData[key] !== null && userProvidedData[key] !== "") {
        result[key] = userProvidedData[key];
      }
    }
  }

  return result;
}

/**
 * Generate a random Driver object.
 * @param userProvidedData User-provided data for this driver object
 */
function generateDriverObject(userProvidedData?: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {
    // Mandatory fields - always generate/use
    firstName: userProvidedData?.firstName || generateRandomValue("firstName"),
    lastName: userProvidedData?.lastName || generateRandomValue("lastName"),
    gender: userProvidedData?.gender || generateRandomValue("gender"),
    dateOfBirth: userProvidedData?.dateOfBirth || generateRandomValue("dateOfBirth"),
    licenseNumber: userProvidedData?.licenseNumber || generateRandomValue("licenseNumber"),
  };

  // Add any other user-provided fields that are not mandatory
  if (userProvidedData) {
    for (const key of Object.keys(userProvidedData)) {
      if (!DRIVER_MANDATORY_FIELDS.has(key) && userProvidedData[key] !== undefined && userProvidedData[key] !== null && userProvidedData[key] !== "") {
        result[key] = userProvidedData[key];
      }
    }
  }

  return result;
}

/**
 * Generate a random Vehicle object.
 * @param userProvidedData User-provided data for this vehicle object
 */
function generateVehicleObject(userProvidedData?: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {
    // Mandatory fields - always generate/use
    year: userProvidedData?.year || generateRandomValue("year"),
    make: userProvidedData?.make || generateRandomValue("make"),
    model: userProvidedData?.model || generateRandomValue("model"),
    vin: userProvidedData?.vin || generateRandomValue("vin"),
    ownership: userProvidedData?.ownership || generateRandomValue("ownership"),
  };

  // Add any other user-provided fields that are not mandatory
  if (userProvidedData) {
    for (const key of Object.keys(userProvidedData)) {
      if (!VEHICLE_MANDATORY_FIELDS.has(key) && userProvidedData[key] !== undefined && userProvidedData[key] !== null && userProvidedData[key] !== "") {
        result[key] = userProvidedData[key];
      }
    }
  }

  return result;
}

/**
 * Generate Coverage object with mandatory and optional fields.
 * @param userProvidedData User-provided data for coverages
 */
function generateCoverageObject(userProvidedData?: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {
    // Mandatory fields with defaults
    bodilyInjuryLiability: userProvidedData?.bodilyInjuryLiability || "50,000/100,000",
    propertyDamageLiability: userProvidedData?.propertyDamageLiability || "50,000",
    collision: userProvidedData?.collision || "250",
  };

  // Add any other user-provided fields that are not mandatory
  if (userProvidedData) {
    for (const key of Object.keys(userProvidedData)) {
      if (!COVERAGE_MANDATORY_FIELDS.has(key) && userProvidedData[key] !== undefined && userProvidedData[key] !== null && userProvidedData[key] !== "") {
        result[key] = userProvidedData[key];
      }
    }
  }

  return result;
}
