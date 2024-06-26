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
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore'
import store from 'redux/store'
import EnvironmentUtils from 'utils/EnvironmentsUtils'
import { FirestoreCollection } from './FirestoreCollection'
import FlagsApi from './FlagsApi'
import { IOrganization } from './OrganizationsApi'
import { IProject } from './ProjectsApi'

export enum EnvironmentColor {
  red = 'red',
  orange = 'orange',
  yellow = 'yellow',
  green = 'green',
  teal = 'teal',
  blue = 'blue',
  cyan = 'cyan',
  purple = 'purple',
  pink = 'pink',
}

export interface IEnvironment {
  id: string
  // Order is only on UI, using it together with LS for orders
  order?: number
  projectId: string
  organizationId: string
  name: string
  color: EnvironmentColor
  enabled: boolean
  createdAt: Timestamp
}

export type IDbEnvironment = Omit<IEnvironment, 'enabled'>

export interface IFlagEnvironment {
  id: string
  enabled: boolean
}

export const DefaultEnvironment = {
  production: { name: 'production', color: EnvironmentColor.orange },
  development: { name: 'development', color: EnvironmentColor.blue },
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

  return EnvironmentUtils.sortEnvironmentsWithOrderFromLS(project.id, environments)
}

// Create
interface ICreateEnvironmentParams {
  name: string
  color: EnvironmentColor
}

async function createEnvironment(params: ICreateEnvironmentParams) {
  const organization = store.getState().configuration.organization as IOrganization
  const project = store.getState().configuration.project as IProject
  const createdAt = Timestamp.now()

  const newEnvironment = {
    name: params.name,
    color: params.color,
    organizationId: organization.id,
    projectId: project.id,
    createdAt,
  }

  const newEnvironmentDoc = await addDoc(collection(getFirestore(), FirestoreCollection.environments), newEnvironment)
  await FlagsApi.addEnvironmentToFlags({ ...newEnvironment, enabled: false, id: newEnvironmentDoc.id })

  return { ...newEnvironment, id: newEnvironmentDoc.id }
}

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

// Update
export interface IUpdateEnvironmentRequestParams extends Partial<IEnvironment> {
  id: string
}

async function updateEnvironment({ id, ...updates }: IUpdateEnvironmentRequestParams): Promise<void> {
  return setDoc(doc(getFirestore(), FirestoreCollection.environments, id), updates, { merge: true })
}

// Delete Project Environments
async function deleteEnvironment(environmentId: string) {
  await FlagsApi.removeEnvironmentFromFlags(environmentId)
  await deleteDoc(doc(getFirestore(), FirestoreCollection.environments, environmentId))
}

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
  createEnvironment,
  createDefaultEnvironments,

  // Update
  updateEnvironment,

  // Delete
  deleteEnvironment,
  deleteProjectEnvironments,
}

export default EnvironmentsApi
