import { useAuth0, User as Auth0User, Auth0ContextInterface } from "@auth0/auth0-react"

export interface IUser extends Auth0User {
  id: string
}

function mapUserWithId(user: Auth0User | undefined): IUser | undefined {
  if (!user) {
    return undefined
  }

  return { ...user, id: user.sub?.replace('auth0|', '') as string }
}

export interface IUseAuthContextInterface extends Auth0ContextInterface<IUser> { }

function useAuth(): IUseAuthContextInterface {
  const auth0 = useAuth0()
  const mappedUser = mapUserWithId(auth0.user) as IUser

  return { ...auth0, user: mappedUser }
}

export { useAuth }