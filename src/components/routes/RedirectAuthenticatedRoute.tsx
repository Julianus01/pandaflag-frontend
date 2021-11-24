import { Redirect, RouteProps, Route } from 'react-router-dom'
import RoutePage from './RoutePage'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

function RedirectAuthenticatedRoute(props: RouteProps) {
  const queryClient = useQueryClient()
  const user = useSelector((state: IStoreState) => state.auth.user)

  useEffect(() => {
    queryClient.invalidateQueries()
  }, [queryClient])

  if (user) {
    if (!user?.emailVerified) {
      return <Redirect to={RoutePage.emailVerification()} />
    }

    return <Redirect to={RoutePage.flags()} />
  }

  return <Route {...props} />
}

export default RedirectAuthenticatedRoute
