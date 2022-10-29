import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import { IOrganization } from './OrganizationsApi'
import { MemberType } from './UsersApi'

export enum InvitationStatus {
  pending = 'pending',
  complete = 'complete',
}

export interface IInvitation {
  id: string
  email: string
  memberType: MemberType
  organizationId: string
  status: InvitationStatus
  createdAt: Timestamp
}

async function getPendingInvitations(): Promise<IInvitation[]> {
  const organization = store.getState().configuration.organization as IOrganization

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.invitations),
      where('organizationId', '==', organization.id),
      where('status', '==', InvitationStatus.pending)
    )
  )

  const invitations = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IInvitation[]

  return invitations
}

async function getInvitation(id: string): Promise<IInvitation | undefined> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.invitations, id))

  if (!snapshot.exists()) {
    return undefined
  }

  return { id, ...snapshot.data() } as IInvitation
}

export interface ICreateInvitationParams {
  email: string
  memberType: MemberType
}

async function createInvitation(params: ICreateInvitationParams): Promise<IInvitation> {
  const organization = store.getState().configuration.organization as IOrganization
  const createdAt = Timestamp.now()

  const newInvitation = {
    email: params.email,
    organizationId: organization.id,
    status: InvitationStatus.pending,
    memberType: params.memberType,
    createdAt,
  }

  const newInvitationDoc = await addDoc(collection(getFirestore(), FirestoreCollection.invitations), newInvitation)

  return { ...newInvitation, id: newInvitationDoc.id }
}

export interface IUpdateInvitationRequestParams extends Partial<IInvitation> {
  id: string
}

async function updateInvitation({ id, ...updates }: IUpdateInvitationRequestParams): Promise<void> {
  return setDoc(doc(getFirestore(), FirestoreCollection.invitations, id), updates, { merge: true })
}

const InvitationApi = {
  getPendingInvitations,
  getInvitation,
  createInvitation,
  updateInvitation,
}

export default InvitationApi
