import { useHistory } from 'react-router'
import ReactGA from 'react-ga'
import { useEffectOnce } from 'react-use'

function GaTracking() {
  const history = useHistory()

  history.listen((location) => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
  })

  useEffectOnce(() => {
    ReactGA.set({ page: history.location.pathname })
    ReactGA.pageview(history.location.pathname)
  })

  return null
}

export default GaTracking
