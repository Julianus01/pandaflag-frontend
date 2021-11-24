import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function EmailVerificationRoute(props: RouteProps) {
  const user = useSelector((state: IStoreState) => state.auth.user)

  if (!user || user?.emailVerified) {
    return <Redirect to={RoutePage.root()} />
  }

  return <Route {...props} />
}

export default EmailVerificationRoute
