import { apiPost } from "../api/client";

const BACKEND_ROLE_BY_UI = {
  technician: "technician_operator",
  supervisor: "supervisor_maintenance",
  admin: "administrator",
};

const ROLE_LABEL_BY_BACKEND = {
  technician_operator: "Technician / Operator",
  supervisor_maintenance: "Supervisor Maintenance",
  administrator: "Administrator",
};

const normalizeUser = (user) => ({
  id: user?.id,
  email: user?.email || "",
  name: user?.fullName || user?.name || "",
  role: ROLE_LABEL_BY_BACKEND[user?.role] || user?.role || "",
  roleKey: user?.role || "",
  avatarUrl: user?.avatarUrl ?? null,
});

const normalizeAuthResult = (payload) => {
  const data = payload?.data;
  return {
    user: normalizeUser(data?.user),
    accessToken: data?.accessToken || "",
  };
};

export const mapRoleToBackend = (role) => BACKEND_ROLE_BY_UI[role] || role;

export const loginUser = async ({ email, password }) => {
  const payload = await apiPost(
    "/auth/login",
    { email, password },
    { auth: false },
  );
  return normalizeAuthResult(payload);
};

export const registerUser = async ({ name, email, role, password }) => {
  const payload = await apiPost(
    "/auth/register",
    {
      fullName: name,
      email,
      role: mapRoleToBackend(role),
      password,
    },
    { auth: false },
  );
  return normalizeAuthResult(payload);
};

export const refreshUserSession = async () => {
  const payload = await apiPost("/auth/refresh", undefined, { auth: false });
  return normalizeAuthResult(payload);
};

export const logoutUser = async () =>
  apiPost("/auth/logout", undefined, { auth: false });
