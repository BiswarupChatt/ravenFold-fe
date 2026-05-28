import { getBrowserStorage, safeJsonParse } from '../utils/utils.js'

const AUTH_TOKEN_KEY = 'ravenfold.auth.token'
const AUTH_USER_KEY = 'ravenfold.auth.user'

export const getStoredAuthToken = () => {
  return getBrowserStorage()?.getItem(AUTH_TOKEN_KEY) || ''
}

export const getStoredAuthSession = () => {
  const storage = getBrowserStorage()

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
  const storage = getBrowserStorage()

  if (!storage || !token || !user) {
    return
  }

  storage.setItem(AUTH_TOKEN_KEY, token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearStoredAuthSession = () => {
  const storage = getBrowserStorage()

  if (!storage) {
    return
  }

  storage.removeItem(AUTH_TOKEN_KEY)
  storage.removeItem(AUTH_USER_KEY)
}
