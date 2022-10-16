import { useLocation } from 'react-router'
import { useEffect } from 'react'
import { logEvent } from 'firebase/analytics'
import { analytics } from 'firebase_init'

function GaTracking() {
  const location = useLocation()

  useEffect(() => {
    console.log(analytics)
    logEvent(analytics, 'page_view', { page_location: location.pathname + location.search })
  }, [location])

  return null
}

export default GaTracking
