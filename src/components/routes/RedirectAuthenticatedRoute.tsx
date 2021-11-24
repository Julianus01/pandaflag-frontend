import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useDispatch, useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useEffect } from 'react'
import { configurationActions } from 'redux/ducks/configurationDuck'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const dispatch = useDispatch()
  const user = useSelector((state: IStoreState) => state.auth.user)

  useEffect(() => {
    dispatch(configurationActions.setOrganization(undefined))
  }, [dispatch])

  if (user) {
    if (!user?.emailVerified) {
      return <Redirect to={RoutePage.emailVerification()} />
    }

    return <Redirect to={RoutePage.flags()} />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
