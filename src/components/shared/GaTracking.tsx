import { useLocation } from 'react-router'
import { useEffect } from 'react'
import { getAnalytics, logEvent } from 'firebase/analytics'

function GaTracking() {
  const location = useLocation()
  const analytics = getAnalytics()

  useEffect(() => {
    logEvent(analytics, 'page_view', { page_location: location.pathname + location.search })
  }, [location, analytics])

  return null
}

export default GaTracking
