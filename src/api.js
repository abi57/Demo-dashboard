const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('vio_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const h = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...h, ...(options.headers || {}) },
  })

  // Auth failed — clear session and redirect to login
  if (res.status === 401 || res.status === 403) {
    // Don't redirect if we're already on the login page
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('vio_token')
      localStorage.removeItem('vio_session')
      window.location.href = '/login'
    }
    const err = await res.json().catch(() => ({ detail: 'Not authenticated' }))
    throw new Error(err.detail || 'Not authenticated')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data
}

// Auth
export async function apiLogin(company, password) {
  // Login doesn't need auth token, call directly
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Login failed')
  return data
}

export async function apiChangePassword(currentPassword, newPassword) {
  return request('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  })
}

// Installations
export async function apiListInstallations() {
  return request('/api/installations')
}

export async function apiGetInstallation(id) {
  return request(`/api/installations/${id}`)
}

export async function apiCreateInstallation(data) {
  return request('/api/installations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiUpdateInstallation(id, data) {
  return request(`/api/installations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function apiDeleteInstallation(id) {
  return request(`/api/installations/${id}`, { method: 'DELETE' })
}

// Media
export async function apiUploadMedia(installationId, mediaType, file) {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('installation_id', installationId)
  formData.append('media_type', mediaType)

  const h = {}
  if (token) h['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}/api/media/upload`, {
    method: 'POST',
    headers: h,
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }))
    throw new Error(err.detail || 'Upload failed')
  }
  return res.json()
}

export async function apiListMedia(installationId) {
  return request(`/api/media/${installationId}`)
}

export async function apiDeleteMedia(mediaId) {
  return request(`/api/media/${mediaId}`, { method: 'DELETE' })
}
