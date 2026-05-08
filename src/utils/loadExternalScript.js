const scriptPromises = new Map()

const loadExternalScript = (src, id) => {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('External scripts are only available in the browser.'))
  }

  const scriptId = id || src

  if (scriptPromises.has(scriptId)) {
    return scriptPromises.get(scriptId)
  }

  const existingScript = document.getElementById(scriptId)

  if (existingScript?.dataset.loaded === 'true') {
    const promise = Promise.resolve(existingScript)
    scriptPromises.set(scriptId, promise)
    return promise
  }

  const promise = new Promise((resolve, reject) => {
    const script = existingScript || document.createElement('script')

    const cleanup = () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }

    const handleLoad = () => {
      script.dataset.loaded = 'true'
      cleanup()
      resolve(script)
    }

    const handleError = () => {
      cleanup()
      scriptPromises.delete(scriptId)
      reject(new Error(`Unable to load ${src}`))
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    if (!existingScript) {
      script.async = true
      script.defer = true
      script.id = scriptId
      script.src = src
      document.head.appendChild(script)
    }
  })

  scriptPromises.set(scriptId, promise)
  return promise
}

export default loadExternalScript

