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

export enum InvitationStatus {
  pending = 'pending',
  completed = 'completed',
}

export interface IInvitation {
  id: string
  email: string
  organizationId: string
  status: InvitationStatus
  createdAt: Timestamp
}

async function getInvitations(): Promise<IInvitation[]> {
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

async function createInvitation(email: string): Promise<IInvitation> {
  const organization = store.getState().configuration.organization as IOrganization
  const createdAt = Timestamp.now()

  const newInvitation = {
    email,
    organizationId: organization.id,
    status: InvitationStatus.pending,
    createdAt,
  }

  const newInvitationDoc = await addDoc(collection(getFirestore(), FirestoreCollection.invitations), newInvitation)

  return { ...newInvitation, id: newInvitationDoc.id }
}

const InvitationApi = {
  getInvitations,
  createInvitation,
}

export default InvitationApi
