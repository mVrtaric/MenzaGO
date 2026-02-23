declare global {
  interface Window {
    google?: any
    __gmapsPromise?: Promise<any>
  }
}

export async function loadGoogleMaps(apiKey: string): Promise<any> {
  if (typeof window === 'undefined') throw new Error('Google Maps can only be loaded in the browser')
  if (window.google?.maps) return window.google.maps
  if (window.__gmapsPromise) return window.__gmapsPromise

  window.__gmapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google?.maps))
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')))
      return
    }

    const script = document.createElement('script')
    script.dataset.googleMaps = 'true'
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps)
      else reject(new Error('Google Maps loaded but window.google.maps is missing'))
    }
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })

  return window.__gmapsPromise
}
