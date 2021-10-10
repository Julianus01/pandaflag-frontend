import { useAuth0, User as Auth0User, Auth0ContextInterface } from "@auth0/auth0-react"
import { useSelector } from 'react-redux'

export interface IUser extends Auth0User {
  id: string
}

export interface IUseAuthContextInterface extends Auth0ContextInterface<IUser> { }

function useAuth(): IUseAuthContextInterface {
  const auth0 = useAuth0()
  const reduxUser = useSelector((state: any) => state.auth.user)

  return { ...auth0, user: reduxUser }
}

export { useAuth }