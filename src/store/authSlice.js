import { createSlice } from '@reduxjs/toolkit'
import { getStoredAuthSession } from '../services/authStorage.js'

const storedSession = getStoredAuthSession()

const initialState = {
  isAuthenticated: Boolean(storedSession.token && storedSession.user),
  token: storedSession.token,
  user: storedSession.user,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthSession: (state) => {
      state.isAuthenticated = false
      state.token = ''
      state.user = null
    },
    setAuthSession: (state, action) => {
      const { token = '', user = null } = action.payload || {}

      state.isAuthenticated = Boolean(token && user)
      state.token = token
      state.user = user
    },
  },
})

export const { clearAuthSession, setAuthSession } = authSlice.actions

export const selectAuthUser = (state) => state.auth.user
export const selectAuthToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export default authSlice.reducer

