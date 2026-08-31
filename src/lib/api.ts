const API_BASE_URL = "https://lostfound-backend-awq7.onrender.com/api";
//const API_BASE_URL = "http://localhost:7000/api";

function getToken(): string | null {
  try {
    return localStorage.getItem("achados-luanda-token");
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem("achados-luanda-token", token);
    } else {
      localStorage.removeItem("achados-luanda-token");
    }
  } catch {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) =>
    request<any>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => request<any>("/auth/me"),
  updateProfile: (formData: FormData) =>
    request<any>("/user/profile", { method: "PUT", body: formData }),

  // Occurrences
  getOccurrences: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/occurrences${query}`);
  },
  getOccurrence: (id: string) => request<any>(`/occurrences/${id}`),
  createOccurrence: (data: any) =>
    request<any>("/occurrences", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  updateOccurrence: (id: string, data: any) =>
    request<any>(`/occurrences/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  updateStatus: (id: string, status: string) =>
    request<any>(`/occurrences/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteOccurrence: (id: string) => request<any>(`/occurrences/${id}`, { method: "DELETE" }),

  getPublicStats: () =>
    request<{
      totalOccurrences: number;
      resolvedOccurrences: number;
      totalUsers: number;
      successRate: string;
    }>("/occurrences/stats/public"),

  // Categories & Locations
  getCategories: () => request<string[]>("/categories"),
  getLocations: () =>
    request<{
      municipalities: string[];
      neighborhoods: Record<string, string[]>;
      fullList?: any[];
    }>("/locations/municipalities"),
  createMunicipality: (name: string, neighborhoods: string[]) =>
    request<any>("/locations/municipalities", {
      method: "POST",
      body: JSON.stringify({ name, neighborhoods }),
    }),
  updateMunicipality: (id: string, name?: string, neighborhoods?: string[]) =>
    request<any>(`/locations/municipalities/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, neighborhoods }),
    }),
  deleteMunicipality: (id: string) =>
    request<any>(`/locations/municipalities/${id}`, { method: "DELETE" }),

  // User Space & Search Users
  getUserOccurrences: () => request<any[]>("/user/occurrences"),
  getFavorites: () => request<any[]>("/user/favorites"),
  getFavoriteIds: () => request<string[]>("/user/favorites/ids"),
  addFavorite: (occurrenceId: string) =>
    request<any>(`/user/favorites/${occurrenceId}`, { method: "POST" }),
  removeFavorite: (occurrenceId: string) =>
    request<any>(`/user/favorites/${occurrenceId}`, { method: "DELETE" }),

  getNotifications: () => request<any[]>("/user/notifications"),
  markNotificationRead: (id: string) =>
    request<any>(`/user/notifications/${id}/read`, { method: "PATCH" }),
  searchUsers: (q: string) => request<any[]>(`/users/search?q=${encodeURIComponent(q)}`),

  // Conversations & Chat
  getConversations: () => request<any[]>("/conversations"),
  getMessages: (id: string) => request<any[]>(`/conversations/${id}/messages`),
  sendMessage: (id: string, text: string) =>
    request<any>(`/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  startConversation: (targetUserId: string, occurrenceId?: string) =>
    request<any>("/conversations", {
      method: "POST",
      body: JSON.stringify({ targetUserId, occurrenceId }),
    }),

  // Reports
  createReport: (occurrenceId: string, reason: string) =>
    request<any>("/reports", { method: "POST", body: JSON.stringify({ occurrenceId, reason }) }),

  // Admin
  getAdminStats: () => request<any>("/admin/stats"),
  getAdminActivities: () => request<any[]>("/admin/activities"),
  getAdminUsers: () => request<any[]>("/users"),
  updateUserRole: (id: string, role: string) =>
    request<any>(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  deleteUser: (id: string) => request<any>(`/users/${id}`, { method: "DELETE" }),
  getAdminReports: () => request<any[]>("/admin/reports"),
  resolveReport: (id: string, action: string) =>
    request<any>(`/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify({ action }) }),
  getAdminSettings: () => request<any>("/admin/settings"),
  updateAdminSettings: (data: any) =>
    request<any>("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
};
