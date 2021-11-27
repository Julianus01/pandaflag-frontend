import { useHistory } from 'react-router'
import ReactGA from 'react-ga'
import { useEffectOnce } from 'react-use'

function GaTracking() {
  const history = useHistory()

  history.listen((location) => {
    ReactGA.set({ page: location.pathname + location.search })
    ReactGA.pageview(location.pathname + location.search)
  })

  useEffectOnce(() => {
    ReactGA.set({ page: history.location.pathname + history.location.search })
    ReactGA.pageview(history.location.pathname + history.location.search)
  })

  return null
}

export default GaTracking
