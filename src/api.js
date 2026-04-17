const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function headers() {
  const h = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('vio_token')
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

function authHeaders() {
  const h = {}
  const token = localStorage.getItem('vio_token')
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: headers(), ...options })
  if (res.status === 401) {
    localStorage.removeItem('vio_token')
    localStorage.removeItem('vio_session')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data
}

// Auth
export async function apiLogin(company, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ company, password }),
  })
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

// Media upload
export async function apiUploadMedia(installationId, mediaType, file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('installation_id', installationId)
  formData.append('media_type', mediaType)

  const res = await fetch(`${BASE}/api/media/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json()
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

export async function apiDeleteInstallation(id) {
  return request(`/api/installations/${id}`, { method: 'DELETE' })
}
