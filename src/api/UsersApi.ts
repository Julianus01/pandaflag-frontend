import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
  getDocs,
  query,
  collection,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'
import { FirestoreCollection } from './FirestoreCollection'
import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
import OrganizationsApi from './OrganizationsApi'

export interface IMemberRelation {
  id: string
  type: MemberType
}

export interface IMember extends IUser {
  type: MemberType
  createdAt: Timestamp
  updatedAt: Timestamp
}

export enum MemberType {
  admin = 'admin',
  member = 'member',
}

async function updateUser(user: IUser): Promise<void> {
  const newUser = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  const newUserDoc = await setDoc(doc(getFirestore(), FirestoreCollection.users, user.uid), newUser)
  return newUserDoc
}

async function upsertUser(user: IUser): Promise<void> {
  await setDoc(doc(getFirestore(), FirestoreCollection.users, user.uid), user, { merge: true })
}

async function getOrganizationMembers(orgId?: string) {
  const storeOrganization = store.getState().configuration.organization
  const organization = orgId ? await OrganizationsApi.getOrganizationById(orgId) : storeOrganization

  const relations = organization?.members
  const relationIds = relations?.map((relation) => relation.id)

  const usersQuerySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.users), where('uid', 'in', relationIds))
  )

  const users = usersQuerySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const userRelation = relations?.find((relation) => relation.id === doc.id)

    const data = doc.data() as IMember
    return { ...data, id: doc.id, type: userRelation?.type }
  }) as IMember[]

  return users
}

async function getUserByEmail(email: string): Promise<IUser | undefined> {
  const usersQuerySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.users), where('email', '==', email))
  )

  if (usersQuerySnapshot.empty) {
    return undefined
  }

  const [user] = usersQuerySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  }) as IUser[]

  return user
}

async function doesUserHaveOrganization(email: string): Promise<boolean> {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new Error(`User with the given email doesn't exist`)
  }

  const userOrganization = await OrganizationsApi.getOrganization(user.uid)
  return Boolean(userOrganization)
}

async function removeMemberFromOrganization(memberId: string) {
  const organization = store.getState().configuration.organization

  if (!organization) {
    throw new Error('No organization')
  }

  const newOrganizationMembers = organization?.members.filter(
    (memberRelation: IMemberRelation) => memberRelation.id !== memberId
  )

  await OrganizationsApi.updateOrganization({ id: organization?.id, members: newOrganizationMembers })
}

const UsersApi = {
  // Create
  updateUser,

  // Upsert
  upsertUser,

  // Members
  getOrganizationMembers,
  removeMemberFromOrganization,

  // Helpers
  // canInviteMember,
  doesUserHaveOrganization,
}

export default UsersApi
