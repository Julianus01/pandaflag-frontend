import { useLocation } from 'react-router'
import ReactGA from 'react-ga'
import { useEffect } from 'react'
import CommonUtils, { NodeEnvironment } from 'utils/CommonUtils'

function GaTracking() {
  const location = useLocation()

  useEffect(() => {
    if (CommonUtils.isNodeEnvironment(NodeEnvironment.production)) {
      ReactGA.set({ page: location.pathname + location.search })
      ReactGA.pageview(location.pathname + location.search)
    }
  }, [location])

  return null
}

export default GaTracking
