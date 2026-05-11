import loadExternalScript from '../utils/loadExternalScript.js'

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const FACEBOOK_SCRIPT_ID = 'facebook-jssdk'
const FACEBOOK_SCRIPT_SRC = 'https://connect.facebook.net/en_US/sdk.js'

export const requestGoogleLogin = async ({ clientId }) => {
  if (!clientId) {
    throw new Error('Set VITE_GOOGLE_CLIENT_ID to enable Google sign in.')
  }

  await loadExternalScript(GOOGLE_SCRIPT_SRC, GOOGLE_SCRIPT_ID)

  const googleOAuth = window.google?.accounts?.oauth2

  if (!googleOAuth) {
    throw new Error('Google sign in is unavailable.')
  }

  return new Promise((resolve, reject) => {
    const tokenClient = googleOAuth.initTokenClient({
      callback: (response) => {
        if (response?.error) {
          reject(new Error(response.error_description || response.error))
          return
        }

        if (response?.access_token) {
          resolve(response.access_token)
          return
        }

        reject(new Error('Google sign in was cancelled.'))
      },
      client_id: clientId,
      error_callback: (error) => {
        reject(new Error(error?.message || error?.type || 'Google sign in failed.'))
      },
      scope: 'openid email profile',
    })

    tokenClient.requestAccessToken({
      prompt: 'select_account',
    })
  })
}

export const requestFacebookLogin = async ({ appId, version }) => {
  if (!appId) {
    throw new Error('Set VITE_FACEBOOK_APP_ID to enable Facebook sign in.')
  }

  const facebookSdk = await new Promise((resolve, reject) => {
    if (window.FB) {
      window.FB.init({
        appId,
        cookie: true,
        version,
        xfbml: false,
      })
      resolve(window.FB)
      return
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        version,
        xfbml: false,
      })
      resolve(window.FB)
    }

    loadExternalScript(FACEBOOK_SCRIPT_SRC, FACEBOOK_SCRIPT_ID).catch(reject)
  })

  return new Promise((resolve, reject) => {
    facebookSdk.login(
      (response) => {
        const accessToken = response?.authResponse?.accessToken

        if (response?.status === 'connected' && accessToken) {
          resolve(accessToken)
          return
        }

        reject(new Error('Facebook sign in was cancelled.'))
      },
      {
        return_scopes: true,
        scope: 'email,public_profile',
      },
    )
  })
}
