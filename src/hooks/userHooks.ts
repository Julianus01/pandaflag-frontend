import { IMemberRelation, MemberType } from 'api/UsersApi'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

export function useCurrentUserMemberType() {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const userMemberType = useMemo(() => {
    const foundMemberRelation = organization?.members.find(
      (memberRelation: IMemberRelation) => memberRelation.id === user?.uid
    )

    return foundMemberRelation?.type as MemberType
  }, [user, organization])

  return userMemberType
}

export function useIsCurrentUserMemberType(memberType: MemberType) {
  const userMemberType = useCurrentUserMemberType()

  return userMemberType === memberType
}
