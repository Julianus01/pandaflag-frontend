import { useAuth0, Auth0ContextInterface } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { IUser } from 'redux/ducks/authDuck'
import { IStoreState } from 'redux/store'

export interface IUseAuthContextInterface extends Auth0ContextInterface<IUser> {}

export function useAuth(): IUseAuthContextInterface {
  const auth0 = useAuth0()
  const reduxUser = useSelector((state: IStoreState) => state.auth.user)

  return { ...auth0, user: reduxUser }
}
