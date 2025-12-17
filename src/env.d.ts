declare global {
  interface ReclaimStringsResult {
    start_location: number;
    end_location: number;
  }

  interface ReclaimStrings {
    evaluateJsonPath: (path: string, json: string) => ReclaimStringsResult[];
    evaluateXPath: (
      path: string,
      xml: string,
      contentsOnly: boolean,
    ) => ReclaimStringsResult[];
  }

  interface Window {
    /**
     * Ensure this is available before usage
     *
     * Can be installed by calling `installReclaimStrings`.
     */
    reclaimStrings: ReclaimStrings;
  }
}

export {};
