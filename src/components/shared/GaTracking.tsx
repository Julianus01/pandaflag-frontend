import { useLocation } from 'react-router'
import ReactGA from 'react-ga'
import { useEffect } from 'react'

function GaTracking() {
  const location = useLocation()

  useEffect(() => {
    ReactGA.set({ page: location.pathname + location.search })
    ReactGA.pageview(location.pathname + location.search)
  }, [location])

  return null
}

export default GaTracking
