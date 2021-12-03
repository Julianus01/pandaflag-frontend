import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import { IProject } from './ProjectsApi'

export interface IEnvironment {
  id: string
  projectId: string
  organizationId: string
  name: string
  color: string
  enabled: boolean
  createdAt: Timestamp
}

export type IDbEnvironment = Omit<IEnvironment, 'enabled'>

export interface IFlagEnvironment {
  id: string
  enabled: boolean
}

export const DefaultEnvironment = {
  production: { name: 'production', color: 'orange' },
  development: { name: 'development', color: 'blue' },
}

// Get
async function getEnvironments(): Promise<IDbEnvironment[]> {
  const project = store.getState().configuration.project as IProject

  const querySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.environments), where('projectId', '==', project.id))
  )

  const environments = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IDbEnvironment[]

  return environments.sort((a, b) => b.name.localeCompare(a.name))
}

// Create
async function createDefaultEnvironments(organizationId: string, projectId: string): Promise<void> {
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
