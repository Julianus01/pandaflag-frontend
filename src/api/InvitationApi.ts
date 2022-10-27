import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import { IOrganization } from './OrganizationsApi'
import { MemberType } from './UsersApi'

export enum InvitationStatus {
  pending = 'pending',
  completed = 'completed',
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
    query(collection(getFirestore(), FirestoreCollection.invitations), where('organizationId', '==', organization.id))
  )

  const invitations = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IInvitation[]

  return invitations
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

const InvitationApi = {
  getPendingInvitations,
  createInvitation,
}

export default InvitationApi
