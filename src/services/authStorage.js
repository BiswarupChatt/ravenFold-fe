const AUTH_TOKEN_KEY = 'ravenfold.auth.token'
const AUTH_USER_KEY = 'ravenfold.auth.user'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export const getStoredAuthToken = () => {
  return getStorage()?.getItem(AUTH_TOKEN_KEY) || ''
}

export const getStoredAuthSession = () => {
  const storage = getStorage()

  if (!storage) {
    return {
      token: '',
      user: null,
    }
  }

  const token = storage.getItem(AUTH_TOKEN_KEY) || ''
  const user = safeJsonParse(storage.getItem(AUTH_USER_KEY))

  if (!token || !user) {
    return {
      token: '',
      user: null,
    }
  }

  return {
    token,
    user,
  }
}

export const saveAuthSession = ({ token, user }) => {
  const storage = getStorage()

  if (!storage || !token || !user) {
    return
  }

  storage.setItem(AUTH_TOKEN_KEY, token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearStoredAuthSession = () => {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.removeItem(AUTH_TOKEN_KEY)
  storage.removeItem(AUTH_USER_KEY)
}

