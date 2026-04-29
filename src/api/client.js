export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

let accessToken = null;

const toApiError = (status, payload, fallbackMessage) => {
  const error = new Error(
    payload?.message || fallbackMessage || `API Error: ${status}`,
  );
  error.status = status;
  error.payload = payload;
  return error;
};

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const payload = await parseResponseBody(response);
  if (!response.ok) {
    throw toApiError(response.status, payload, "Session refresh failed");
  }

  const token = payload?.data?.accessToken;
  if (!token) {
    throw toApiError(response.status, payload, "Missing access token");
  }

  accessToken = token;
  return payload;
};

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const apiFetch = async (path, options = {}, retry401 = true) => {
  const { body, headers, auth = true, ...restOptions } = options;
  const requestHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...restOptions,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && retry401) {
    try {
      await refreshAccessToken();
      return apiFetch(path, options, false);
    } catch {
      clearAccessToken();
    }
  }

  const payload = await parseResponseBody(response);
  if (!response.ok) {
    throw toApiError(response.status, payload);
  }

  return payload;
};

export const apiGet = (path, options = {}) =>
  apiFetch(path, { ...options, method: "GET" });

export const apiPost = (path, body, options = {}) =>
  apiFetch(path, { ...options, method: "POST", body });
