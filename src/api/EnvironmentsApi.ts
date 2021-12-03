import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  where,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  setDoc,
} from 'firebase/firestore'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import FlagsApi from './FlagsApi'
import { v4 as uuidv4 } from 'uuid'
import { IOrganization } from './OrganizationsApi'

export interface IEnvironment {
  // TODO: Change this to required
  id?: string
  name: string
  color: string

  // TODO: Change this to required
  createdAt?: Timestamp
  projectId?: string
  organizationId?: string
}

export const DefaultEnvironment = {
  production: { name: 'production', color: 'orange' },
  development: { name: 'development', color: 'blue' },
}

async function createDefaultEnvironments(organizationId: string, projectId: string) {
  console.log('here')
  const createdAt = Timestamp.now()

  await Promise.all([
    addDoc(collection(getFirestore(), FirestoreCollection.environments), {
      ...DefaultEnvironment.development,
      organizationId,
      projectId,
      createdAt,
    }),

    addDoc(collection(getFirestore(), FirestoreCollection.environments), {
      ...DefaultEnvironment.production,
      organizationId,
      projectId,
      createdAt,
    }),
  ])
}

const EnvironmentsApi = {
  // Create
  createDefaultEnvironments,
}

export default EnvironmentsApi
