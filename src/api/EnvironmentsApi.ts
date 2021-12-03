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
  writeBatch,
} from 'firebase/firestore'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import FlagsApi from './FlagsApi'
import { v4 as uuidv4 } from 'uuid'
import { IOrganization } from './OrganizationsApi'
import { IProject } from './ProjectsApi'

export interface IEnvironment {
  id: string
  projectId: string
  organizationId: string
  name: string 
  color: string
  createdAt: Timestamp
}

export const DefaultEnvironment = {
  production: { name: 'production', color: 'orange' },
  development: { name: 'development', color: 'blue' },
}

// Get
async function getEnvironments(): Promise<IEnvironment[]> {
  const project = store.getState().configuration.project as IProject

  const querySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.environments), where('projectId', '==', project.id))
  )

  const environments = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IEnvironment[]

  return environments.sort((a, b) => a.name.localeCompare(b.name))
}

// Create
async function createDefaultEnvironments(organizationId: string, projectId: string): Promise<void> {
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

// Delete Project Environments
async function deleteProjectEnvironments(projectId: string): Promise<void> {
  const querySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.environments), where('projectId', '==', projectId))
  )

  const batch = writeBatch(getFirestore())
  querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    batch.delete(doc.ref)
  })

  return batch.commit()
}

const EnvironmentsApi = {
  // Get
  getEnvironments,

  // Create
  createDefaultEnvironments,

  //   Delete
  deleteProjectEnvironments,
}

export default EnvironmentsApi
