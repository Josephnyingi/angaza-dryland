export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string

  function getAuthHeaders(): Record<string, string> {
    const token = process.client
      ? localStorage.getItem('angaza_token') ?? ''
      : ''
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return $fetch<T>(path, {
      baseURL,
      method: 'GET',
      params,
      headers: getAuthHeaders(),
    })
  }

  async function post<T>(path: string, body?: unknown): Promise<T> {
    return $fetch<T>(path, {
      baseURL,
      method: 'POST',
      body,
      headers: getAuthHeaders(),
    })
  }

  async function put<T>(path: string, body?: unknown): Promise<T> {
    return $fetch<T>(path, {
      baseURL,
      method: 'PUT',
      body,
      headers: getAuthHeaders(),
    })
  }

  async function del<T>(path: string): Promise<T> {
    return $fetch<T>(path, {
      baseURL,
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
  }

  return { get, post, put, del }
}
