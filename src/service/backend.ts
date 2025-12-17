export const BACKEND_API_BASE_URL =
  import.meta.env.VITE_RECLAIM_BACKEND_URL || "https://api.reclaimprotocol.org";

/**
 * SDK backend Api endpoints
 */
export const SDK_BACKEND_API_ENDPOINTS = {
  APPLICATION: (applicationId: string) =>
    `${BACKEND_API_BASE_URL}/api/applications/info/${applicationId}`,
  PROVIDER: (providerId: string, providerVersion: string | undefined) => {
    const url = `${BACKEND_API_BASE_URL}/api/providers/${providerId}`;
    if (providerVersion) {
      return `${url}?versionNumber=${providerVersion}`;
    }
    return url;
  },
} as const;

export const fetchApplicationInfo = async (applicationId: string) => {
  const response = await fetch(
    SDK_BACKEND_API_ENDPOINTS.APPLICATION(applicationId),
  );
  if (response.ok) {
    return response.json().then((data) => data.application);
  }
  throw new Error("Failed to fetch application info");
};

export const fetchProviderInfo = async (
  providerId: string,
  providerVersion?: string,
) => {
  const response = await fetch(
    SDK_BACKEND_API_ENDPOINTS.PROVIDER(providerId, providerVersion),
  );
  if (response.ok) {
    return response.json().then((data) => data.providers);
  }
  throw new Error("Failed to fetch provider info");
};
