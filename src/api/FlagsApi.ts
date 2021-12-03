import {
  collection,
  query,
  getDocs,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  where,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  DocumentReference,
  writeBatch,
  setDoc,
} from 'firebase/firestore'
import store from 'redux/store'
import { IEnvironment } from './EnvironmentsApi'
import { FirestoreCollection } from './FirestoreCollection'
import { IOrganization } from './OrganizationsApi'
import { IProject } from './ProjectsApi'

export interface IFlag {
  id: string
  organizationId: string
  projectId: string
  name: string
  description?: string
  enabled: boolean
  environmentName: string
  createdAt: Timestamp
}

// Get Flags
async function getFlags(): Promise<IFlag[]> {
  // TODO:
  return []
  // const project = store.getState().configuration.project as IProject
  // const environment = store.getState().configuration.environment as IEnvironment

  // const querySnapshot = await getDocs(
  //   query(
  //     collection(getFirestore(), FirestoreCollection.flags),
  //     where('projectId', '==', project.id),
  //     where('environmentName', '==', environment.name)
  //   )
  // )

  // const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
  //   const data = doc.data()
  //   return { ...data, id: doc.id }
  // }) as IFlag[]

  // return flags.sort((a, b) => a.name.localeCompare(b.name))
}

async function getFlag(id: string): Promise<IFlag | undefined> {
  // TODO:
  return undefined
  // const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.flags, id))

  // if (!snapshot.exists()) {
  //   return undefined
  // }

  // return { id, ...snapshot.data() } as IFlag
}

async function getFlagByName(name: string): Promise<IFlag | undefined> {
  // TODO:
  return undefined
  // const project = store.getState().configuration.project as IProject
  // const environment = store.getState().configuration.environment as IEnvironment

  // const querySnapshot = await getDocs(
  //   query(
  //     collection(getFirestore(), FirestoreCollection.flags),
  //     where('projectId', '==', project.id),
  //     where('environmentName', '==', environment.name),
  //     where('name', '==', name)
  //   )
  // )

  // const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
  //   const data = doc.data()
  //   return { ...data, id: doc.id }
  // }) as IFlag[]

  // if (!flags.length) {
  //   return undefined
  // }

  // return flags[0]
}

// Create Flag
interface ICreateFlagRequestParams {
  name: string
  description?: string
}

async function createFlag({ name, description = '' }: ICreateFlagRequestParams): Promise<IFlag> {
  // TODO:
  return {} as any
  // const organization = store.getState().configuration.organization as IOrganization
  // const project = store.getState().configuration.project as IProject
  // const environment = store.getState().configuration.environment as IEnvironment
  // const createdAt = Timestamp.now()

  // const newFlag = {
  //   name,
  //   organizationId: organization.id,
  //   projectId: project.id,
  //   description,
  //   enabled: false,
  //   environmentName: environment.name,
  //   createdAt,
  // }

  // const newFlagDoc = await addDoc(collection(getFirestore(), FirestoreCollection.flags), newFlag)

  // return { ...newFlag, id: newFlagDoc.id }
}

interface ICreateFlagForAllEnvironmentsRequestParams {
  name: string
  description?: string
}

async function createFlagForAllEnvironments({
  name,
  description = '',
}: ICreateFlagForAllEnvironmentsRequestParams): Promise<
  [DocumentReference<DocumentData>, DocumentReference<DocumentData>]
> {
  const organization = store.getState().configuration.organization as IOrganization
  const project = store.getState().configuration.project as IProject
  const createdAt = Timestamp.now()

  const newFlag = {
    name,
    organizationId: organization.id,
    projectId: project.id,
    description,
    enabled: false,
    createdAt,
  }

  return Promise.all([
    addDoc(collection(getFirestore(), FirestoreCollection.flags), { ...newFlag, environmentName: 'production' }),
    addDoc(collection(getFirestore(), FirestoreCollection.flags), { ...newFlag, environmentName: 'development' }),
  ])
}

// Update
export interface IUpdateFlagRequestParams extends Partial<IFlag> {
  id: string
}

async function updateFlag({ id, ...updates }: IUpdateFlagRequestParams): Promise<void> {
  return setDoc(doc(getFirestore(), FirestoreCollection.flags, id), updates, { merge: true })
}

// Delete Flag
async function deleteFlag(flagId: string): Promise<void> {
  return deleteDoc(doc(getFirestore(), FirestoreCollection.flags, flagId))
}

async function deleteProjectFlags(projectId: string): Promise<void> {
  const querySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.flags), where('projectId', '==', projectId))
  )

  const batch = writeBatch(getFirestore())
  querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    batch.delete(doc.ref)
  })

  return batch.commit()
}

const FlagsApi = {
  // Get
  getFlags,
  getFlag,
  getFlagByName,

  // Create
  createFlag,
  createFlagForAllEnvironments,

  // Update
  updateFlag,

  // Delete
  deleteFlag,
  deleteProjectFlags,
}

export default FlagsApi
