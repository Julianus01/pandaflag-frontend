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
import InvitationApi, { IInvitation } from './InvitationApi'
import EmailApi from './EmailApi'

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

async function getOrganizationMembers() {
  const relations = store.getState().configuration.organization?.members
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

async function inviteMember(email: string) {
  const users = await getOrganizationMembers()
  const alreadyPartOfTeam = users.find((user: IMember) => user.email === email)

  if (alreadyPartOfTeam) {
    throw new Error('A user with this email already exists within your organization')
  }

  const invitations = await InvitationApi.getInvitations()
  const invitationAlreadyPending = invitations.find((invitation: IInvitation) => invitation.email === email)

  if (invitationAlreadyPending) {
    throw new Error(`An invitation is already pending for ${email}. You can resend the invitation from the table`)
  }

  const invitation = await InvitationApi.createInvitation(email)
  await EmailApi.sendMemberInvitation(email, invitation.id)
}

const UsersApi = {
  // Create
  addUserIfDoesntExist,

  // Upsert
  upsertUser,

  // Members
  getOrganizationMembers,
  inviteMember,
}

export default UsersApi
