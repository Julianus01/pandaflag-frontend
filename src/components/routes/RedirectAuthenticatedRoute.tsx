import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)

  if (user) {
    if (!user?.emailVerified) {
      return <Redirect to={RoutePage.emailVerification()} />
    }

    return <Redirect to={RoutePage.flags()} />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
