import axios from 'axios'

// ── Instance Axios ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
  },
})

// Injecter le token Sanctum dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cec_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirection vers login si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cec_token')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ── Albums ─────────────────────────────────────────────────────────────────
export const albumsApi = {
  list: () => api.get('/albums'),
  featured: () => api.get('/albums/featured'),
  show: (slug: string) => api.get(`/albums/${slug}`),
  tracks: (slug: string) => api.get(`/albums/${slug}/tracks`),
}

// ── Tracks ─────────────────────────────────────────────────────────────────
export const tracksApi = {
  incrementPlay: (id: number) => api.post(`/tracks/${id}/play`),
  setDuration: (id: number, durationSeconds: number) =>
    api.post(`/tracks/${id}/duration`, { duration_seconds: durationSeconds }),
}

// ── Events ─────────────────────────────────────────────────────────────────
export const eventsApi = {
  list: (params?: Record<string, unknown>) => api.get('/events', { params }),
  upcoming: () => api.get('/events/upcoming'),
  past: () => api.get('/events/past'),
  show: (slug: string) => api.get(`/events/${slug}`),
}

// ── Posts ──────────────────────────────────────────────────────────────────
export const postsApi = {
  list: (params?: Record<string, unknown>) => api.get('/posts', { params }),
  show: (slug: string) => api.get(`/posts/${slug}`),
}

// ── Gallery ────────────────────────────────────────────────────────────────
export const galleryApi = {
  list: (params?: Record<string, unknown>) => api.get('/gallery', { params }),
  show: (id: number) => api.get(`/gallery/${id}`),
}

// ── Members ────────────────────────────────────────────────────────────────
export const membersApi = {
  list: () => api.get('/members'),
}

// ── Contact ────────────────────────────────────────────────────────────────
export const contactApi = {
  send: (data: unknown) => api.post('/contact', data),
}

// ── Settings ───────────────────────────────────────────────────────────────
export const settingsApi = {
  public: () => api.get('/settings/public'),
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/admin/auth/logout'),
  me: () => api.get('/admin/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/auth/reset-password', data),
}

// ── Admin Albums ───────────────────────────────────────────────────────────
export const adminAlbumsApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/albums', { params }),
  show: (id: number) => api.get(`/admin/albums/${id}`),
  create: (data: unknown) => api.post('/admin/albums', data),
  update: (id: number, data: unknown) => api.put(`/admin/albums/${id}`, data),
  delete: (id: number) => api.delete(`/admin/albums/${id}`),
  toggleFeatured: (id: number) => api.post(`/admin/albums/${id}/toggle-featured`),
  uploadCover: (id: number, file: File) => {
    const fd = new FormData(); fd.append('cover', file)
    return api.post(`/admin/albums/${id}/cover`, fd)
  },
}

// ── Admin Tracks ───────────────────────────────────────────────────────────
export const adminTracksApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/tracks', { params }),
  create: (data: unknown) => api.post('/admin/tracks', data),
  update: (id: number, data: unknown) => api.put(`/admin/tracks/${id}`, data),
  delete: (id: number) => api.delete(`/admin/tracks/${id}`),
  uploadAudio: (id: number, file: File) => {
    const fd = new FormData(); fd.append('audio', file)
    return api.post(`/admin/tracks/${id}/audio`, fd)
  },
  reorder: (data: unknown) => api.post('/admin/tracks/reorder', data),
}

// ── Admin Events ───────────────────────────────────────────────────────────
export const adminEventsApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/events', { params }),
  show: (id: number) => api.get(`/admin/events/${id}`),
  create: (data: unknown) => api.post('/admin/events', data),
  update: (id: number, data: unknown) => api.put(`/admin/events/${id}`, data),
  delete: (id: number) => api.delete(`/admin/events/${id}`),
  uploadCover: (id: number, file: File) => {
    const fd = new FormData(); fd.append('cover', file)
    return api.post(`/admin/events/${id}/cover`, fd)
  },
}

// ── Admin Posts ────────────────────────────────────────────────────────────
export const adminPostsApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/posts', { params }),
  show: (id: number) => api.get(`/admin/posts/${id}`),
  create: (data: unknown) => api.post('/admin/posts', data),
  update: (id: number, data: unknown) => api.put(`/admin/posts/${id}`, data),
  delete: (id: number) => api.delete(`/admin/posts/${id}`),
  publish: (id: number) => api.post(`/admin/posts/${id}/publish`),
  uploadCover: (id: number, file: File) => {
    const fd = new FormData(); fd.append('cover', file)
    return api.post(`/admin/posts/${id}/cover`, fd)
  },
}

// ── Admin Gallery ──────────────────────────────────────────────────────────
export const adminGalleryApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/gallery', { params }),
  upload: (file: File, data: Record<string, string>) => {
    const fd = new FormData()
    fd.append('file', file)
    Object.entries(data).forEach(([k, v]) => fd.append(k, v))
    return api.post('/admin/gallery/upload', fd)
  },
  update: (id: number, data: unknown) => api.put(`/admin/gallery/${id}`, data),
  delete: (id: number) => api.delete(`/admin/gallery/${id}`),
  reorder: (data: unknown) => api.post('/admin/gallery/reorder', data),
}

// ── Admin Members ──────────────────────────────────────────────────────────
export const adminMembersApi = {
  list: () => api.get('/admin/members'),
  create: (data: unknown) => api.post('/admin/members', data),
  update: (id: number, data: unknown) => api.put(`/admin/members/${id}`, data),
  delete: (id: number) => api.delete(`/admin/members/${id}`),
  uploadPhoto: (id: number, file: File) => {
    const fd = new FormData(); fd.append('photo', file)
    return api.post(`/admin/members/${id}/photo`, fd)
  },
  reorder: (data: unknown) => api.post('/admin/members/reorder', data),
}

// ── Admin Contacts ─────────────────────────────────────────────────────────
export const adminContactsApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/contacts', { params }),
  show: (id: number) => api.get(`/admin/contacts/${id}`),
  markAsRead: (id: number) => api.patch(`/admin/contacts/${id}/read`),
  delete: (id: number) => api.delete(`/admin/contacts/${id}`),
}

// ── Admin Settings ─────────────────────────────────────────────────────────
export const adminSettingsApi = {
  get: () => api.get('/admin/settings'),
  update: (data: unknown) => api.put('/admin/settings', data),
}

// ── Admin Dashboard ────────────────────────────────────────────────────────
export const adminDashboardApi = {
  stats: () => api.get('/admin/dashboard/stats'),
}
