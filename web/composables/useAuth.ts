export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  county: string
  role: 'harvester' | 'buyer' | 'admin'
  languagePreference: 'en' | 'sw'
}

export function useAuth() {
  const api = useApi()
  const user = useState<AuthUser | null>('auth_user', () => null)

  const isLoggedIn = computed(() => user.value !== null)
  const isHarvester = computed(() => user.value?.role === 'harvester')
  const isBuyer = computed(() => user.value?.role === 'buyer')
  const isAdmin = computed(() => user.value?.role === 'admin')

  function persistToken(token: string) {
    if (process.client) {
      localStorage.setItem('angaza_token', token)
    }
  }

  function clearToken() {
    if (process.client) {
      localStorage.removeItem('angaza_token')
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    })
    persistToken(response.token)
    user.value = response.user
  }

  async function register(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    county: string
    role: 'harvester' | 'buyer'
    password: string
    languagePreference: 'en' | 'sw'
  }): Promise<void> {
    const response = await api.post<{ token: string; user: AuthUser }>('/auth/register', data)
    persistToken(response.token)
    user.value = response.user
  }

  function logout() {
    clearToken()
    user.value = null
    navigateTo('/auth/login')
  }

  async function fetchMe(): Promise<void> {
    try {
      const me = await api.get<AuthUser>('/auth/me')
      user.value = me
    }
    catch {
      clearToken()
      user.value = null
    }
  }

  // Rehydrate from token on client
  if (process.client) {
    const token = localStorage.getItem('angaza_token')
    if (token && !user.value) {
      fetchMe().catch(() => {})
    }
  }

  return {
    user,
    isLoggedIn,
    isHarvester,
    isBuyer,
    isAdmin,
    login,
    register,
    logout,
    fetchMe,
  }
}
