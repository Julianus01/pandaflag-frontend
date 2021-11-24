import {
  collection,
  getFirestore,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  setDoc,
  doc,
} from 'firebase/firestore'
import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'

export interface IMember {
  id: string
  type: MemberType
}

export enum MemberType {
  admin = 'admin',
}

export interface IOrganization {
  id: string
  name: string
  members: IMember[]
  createdAt: Timestamp
}

// Get Organization
async function getOrganization(): Promise<IOrganization> {
  const user = store.getState().auth.user as IUser
  const memberQueryValue = { id: user.sub, type: 'admin' }

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.organizations),
      where('members', 'array-contains', memberQueryValue)
    )
  )

  const [organization] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IOrganization[]

  return organization
}

// Create Organization
async function createOrganization(name: string): Promise<IOrganization> {
  const user = store.getState().auth.user as IUser
  const createdAt = Timestamp.now()

  const newOrganization = {
    name,
    members: [{ id: user.sub, type: MemberType.admin }],
    createdAt,
  }

  const newOrganizationDoc = await addDoc(
    collection(getFirestore(), FirestoreCollection.organizations),
    newOrganization
  )

  return { ...newOrganization, id: newOrganizationDoc.id }
}

// Update Organization
export interface IUpdateOrganizationRequestParams extends Partial<IOrganization> {
  id: string
}

async function updateOrganization({ id, ...updates }: IUpdateOrganizationRequestParams): Promise<void> {
  return setDoc(doc(getFirestore(), FirestoreCollection.organizations, id), updates, { merge: true })
}

const OrganizationsApi = {
  // Get
  getOrganization,

  // Create
  createOrganization,

  // Update
  updateOrganization,
}

export default OrganizationsApi
