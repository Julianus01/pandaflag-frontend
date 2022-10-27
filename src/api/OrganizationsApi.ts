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
  getDoc,
} from 'firebase/firestore'
import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import { IMemberRelation, MemberType } from './UsersApi'

export interface IOrganization {
  id: string
  name: string
  members: IMemberRelation[]
  createdAt: Timestamp
}

// Get Organization
async function getOrganizationWhereType(memberType: MemberType): Promise<IOrganization | undefined> {
  const user = store.getState().auth.user as IUser
  const memberQueryValue = { id: user.uid, type: memberType }

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.organizations),
      where('members', 'array-contains', memberQueryValue)
    )
  )

  if (querySnapshot.empty) {
    return undefined
  }

  const [organization] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IOrganization[]

  return organization
}

async function getOrganization(): Promise<IOrganization | undefined> {
  const [adminOrganization, memberOrganization] = await Promise.all([
    getOrganizationWhereType(MemberType.admin),
    getOrganizationWhereType(MemberType.member),
  ])

  if (adminOrganization) {
    return adminOrganization
  }

  if (memberOrganization) {
    return memberOrganization
  }

  return undefined
}

async function getOrganizationById(id: string): Promise<IOrganization | undefined> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.organizations, id))

  if (!snapshot.exists()) {
    return undefined
  }

  return { id, ...snapshot.data() } as IOrganization
}

// Create Organization
async function createOrganization(name: string): Promise<IOrganization> {
  const user = store.getState().auth.user as IUser
  const createdAt = Timestamp.now()

  const newOrganization = {
    name,
    members: [{ id: user.uid, type: MemberType.admin }],
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
  getOrganizationById,

  // Create
  createOrganization,

  // Update
  updateOrganization,
}

export default OrganizationsApi
