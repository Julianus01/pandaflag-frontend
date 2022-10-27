import { IMember, MemberType } from 'api/UsersApi'
import { IUser } from 'redux/ducks/authDuck'

function userDisplayName(user: IMember | IUser) {
  if (user.displayName) {
    return user.displayName
  }

  const email = user.email as string
  return email.substr(0, email.indexOf('@'))
}

function getMemberTypeColorSchema(memberType: MemberType) {
  switch (memberType) {
    case MemberType.admin:
      return 'green'

    case MemberType.member:
      return 'blue'

    default:
      break
  }
}

export const UserUtils = {
  userDisplayName,
  getMemberTypeColorSchema,
}
