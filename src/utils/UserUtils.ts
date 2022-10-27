import { IMember, MemberType } from 'api/UsersApi'
import { IUser } from 'redux/ducks/authDuck'

function userDisplayName(user: IMember | IUser) {
  if (user.displayName) {
    return user.displayName
  }

  const email = user.email as string
  return email.substr(0, email.indexOf('@'))
}

function getMemberTypeColorSchema(member: IMember) {
  switch (member.type) {
    case MemberType.admin:
      return 'green'

    default:
      break
  }
}

export const UserUtils = {
  userDisplayName,
  getMemberTypeColorSchema,
}
