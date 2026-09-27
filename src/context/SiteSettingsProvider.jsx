import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultSiteSettings, getSiteSettings } from '../services/siteSettingsApi.js'

const SiteSettingsContext = createContext({
  error: null,
  loading: true,
  refreshSiteSettings: async () => {},
  settings: defaultSiteSettings,
})

function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSettings = async () => {
    setLoading(true)
    setError(null)

    try {
      setSettings(await getSiteSettings())
    } catch (loadError) {
      setSettings(defaultSiteSettings)
      setError(loadError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const value = useMemo(
    () => ({
      error,
      loading,
      refreshSiteSettings: loadSettings,
      settings,
    }),
    [error, loading, settings],
  )

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export { SiteSettingsProvider, useSiteSettings }
export default SiteSettingsProvider
