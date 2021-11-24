import { useSelector } from 'react-redux'
import { IUser } from 'redux/ducks/authDuck'
import { IStoreState } from 'redux/store'

export type IUseAuth = IUser

export function useAuth(): IUseAuth {
  const reduxUser = useSelector((state: IStoreState) => state.auth.user)

  return reduxUser as IUser
}
