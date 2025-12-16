/**
 * Tries to format a value into a human-readable summary.
 * Returns null if formatting fails or isn't applicable.
 */
function formatJsonValueAsHumanizedSummary(value: unknown): string | null {
  try {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return "Not available";
    }

    // Handle objects and arrays directly (not stringified)
    if (typeof value === "object") {
      // Special handling for single-item arrays: recurse down
      if (Array.isArray(value)) {
        if (value.length === 0) return "No items";
        if (value.length === 1) {
          const nestedValue = formatJsonValueAsHumanizedSummary(value[0]);
          if (nestedValue !== null) return nestedValue;
        }
        return `${value.length} items`;
      }

      // Handle objects (Record<string, any>)
      const keys = Object.keys(value);
      if (keys.length === 0) return "No items";
      if (keys.length === 1) return "1 item";
      return `${keys.length} items`;
    }

    // Handle booleans
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Handle numbers
    if (typeof value === "number") {
      if (!Number.isFinite(value)) return "Infinite";
      if (Number.isNaN(value)) return "Not available";
      if (value === 0) return "0";
      if (value === 1) return "1";
      return value.toString();
    }

    // Handle strings
    if (typeof value !== "string") {
      return String(value);
    }

    const input = value.trim();

    // Recursive quote stripping for strings
    if (input.length >= 2 && input.startsWith('"') && input.endsWith('"')) {
      return formatJsonValueAsHumanizedSummary(input.slice(1, -1));
    }

    const lowerInput = input.toLowerCase();

    // Handle specific keywords
    if (["nan", "null", "undefined"].includes(lowerInput)) {
      return "Not available";
    }
    if (["inf", "-inf", "infinity", "-infinity"].includes(lowerInput)) {
      return "Infinite";
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(input);
      // Recursively format the parsed data
      return formatJsonValueAsHumanizedSummary(data);
    } catch {
      // Not valid JSON, return null to fall back to default formatting
      return null;
    }
  } catch (e) {
    console.error("Failed to format value as humanized summary", e);
    return null;
  }
}

/**
 * Helper to check if a string looks like "X item" or "X items"
 */
function _isFormattedAsCollection(value: string): boolean {
  const words = value.split(" ");
  if (words.length !== 2) return false;
  const lastWord = words[words.length - 1];
  return ["item", "items"].includes(lastWord);
}

/**
 * Determines if the input represents a collection by checking formatting results.
 */
export function isValueCollection(input: unknown): boolean {
  const value = formatJsonValueAsHumanizedSummary(input);
  if (value === null) return false;
  return _isFormattedAsCollection(value);
}

/**
 * Main wrapper to format parameter values.
 * @param input The input to format (can be object, array, string, number, boolean, etc.)
 * @param humanize Whether to attempt to humanize the JSON/Structure (default true)
 */
export function formatParamsValue(
  input: unknown,
  humanize: boolean = true,
): string {
  // Handle null/undefined
  if (input === null || input === undefined) {
    return "Empty";
  }

  if (humanize) {
    const humanizedSummary = formatJsonValueAsHumanizedSummary(input);
    if (humanizedSummary !== null) {
      return humanizedSummary;
    }
  }

  // Handle non-string types when humanization is disabled or failed
  if (typeof input === "object") {
    // For objects/arrays, convert to JSON string
    try {
      return JSON.stringify(input);
    } catch {
      return String(input);
    }
  }

  if (typeof input === "boolean") {
    return input ? "true" : "false";
  }

  if (typeof input === "number") {
    return input.toString();
  }

  // Handle strings
  let text = String(input).trim();

  // Strip surrounding quotes if present
  if (text.length > 2 && text.startsWith('"') && text.endsWith('"')) {
    text = text.slice(1, -1).trim();
  }

  if (text.length === 0) return "Empty";

  return text;
}

// Helper: Format parameter key for display
export const formatParamKey = (key: string): string => {
  let text = key.trim();

  // If the text is all uppercase, convert to lowercase first
  if (text === text.toUpperCase()) {
    text = text.toLowerCase();
  }

  // Replace all whitespace sequences with an underscore
  text = text.replace(/\s+/g, "_");

  // Split by positive lookahead for Uppercase letters (camelCase) OR underscores
  const words = text.split(/(?=[A-Z])|_/);

  text = words
    .map((word) => {
      if (!word) return "";
      // Capitalize first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    })
    .join(" ");

  return text;
};

export const formatVariables = (variables: string[]): string => {
  const formattedVariables = variables.map((variable) =>
    formatParamKey(variable),
  );

  if (formattedVariables.length === 0) {
    return "your data";
  } else if (formattedVariables.length === 1) {
    return formattedVariables[0];
  } else if (formattedVariables.length === 2) {
    return `${formattedVariables[0]} and ${formattedVariables[1]}`;
  } else {
    const allButLast = formattedVariables.slice(0, -1).join(", ");
    const last = formattedVariables[formattedVariables.length - 1];
    return `${allButLast}, and ${last}`;
  }
};
