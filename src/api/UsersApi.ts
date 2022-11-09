import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
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

async function addUserIfDoesntExist(user: IUser): Promise<void> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.users, user.uid))

  if (snapshot.exists()) {
    return
  }

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

async function doesUserAlreadyExistAndHasOrganization(email: string): Promise<boolean> {
  const usersQuerySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.users), where('email', '==', email))
  )

  if (usersQuerySnapshot.empty) {
    return false
  }

  const [user] = usersQuerySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  }) as IUser[]

  const userOrganization = await OrganizationsApi.getOrganization(user.uid)

  if (userOrganization) {
    return false
  }

  return true
}

interface ICanInviteMemberParams {
  orgId: string
  email: string
}

async function canInviteMember(params: ICanInviteMemberParams): Promise<boolean> {
  const userAlreadyExists = await doesUserAlreadyExistAndHasOrganization(params.email)
  if (userAlreadyExists) {
    throw new Error(`A user with this email already exists`)
  }

  const users = await getOrganizationMembers(params.orgId)
  const alreadyPartOfTeam = users.find((user: IMember) => user.email === params.email)

  if (alreadyPartOfTeam) {
    throw new Error(`A user with this email already exists within the organization`)
  }

  return true
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
  addUserIfDoesntExist,

  // Upsert
  upsertUser,

  // Members
  getOrganizationMembers,
  removeMemberFromOrganization,

  // Helpers
  doesUserAlreadyExistAndHasOrganization,
  canInviteMember,
}

export default UsersApi
