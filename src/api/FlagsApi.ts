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
  writeBatch,
  setDoc,
} from 'firebase/firestore'
import store from 'redux/store'
import EnvironmentsApi, { IEnvironment } from './EnvironmentsApi'
import { FirestoreCollection } from './FirestoreCollection'
import { IOrganization } from './OrganizationsApi'
import { IProject } from './ProjectsApi'

export interface IFlag {
  id: string
  organizationId: string
  projectId: string
  name: string
  description?: string
  environments: IFlagEnvironment[]
  createdAt: Timestamp
}

export interface IFlagEnvironment extends IEnvironment {
  enabled: boolean
}

interface DbFlagEnvironment {
  id: string
  enabled: boolean
}

// Get Flags
async function getFlags(): Promise<IFlag[]> {
  const project = store.getState().configuration.project as IProject
  const environments = await EnvironmentsApi.getEnvironments()

  const querySnapshot = await getDocs(
    query(collection(getFirestore(), FirestoreCollection.flags), where('projectId', '==', project.id))
  )

  const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data() as IFlag

    const flagEnvironments: IFlagEnvironment[] = data.environments.map((flagEnvironment: DbFlagEnvironment) => {
      const found = environments.find((environment: IEnvironment) => environment.id === flagEnvironment.id)
      return { ...found, enabled: flagEnvironment.enabled }
    }) as IFlagEnvironment[]

    return { ...data, id: doc.id, environments: flagEnvironments }
  }) as IFlag[]

  return flags.sort((a, b) => a.name.localeCompare(b.name))
}

async function getFlag(id: string): Promise<IFlag | undefined> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.flags, id))

  if (!snapshot.exists()) {
    return undefined
  }

  return { id, ...snapshot.data() } as IFlag
}

async function getFlagByName(name: string): Promise<IFlag | undefined> {
  const project = store.getState().configuration.project as IProject

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.flags),
      where('projectId', '==', project.id),
      where('name', '==', name)
    )
  )

  const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IFlag[]

  if (!flags.length) {
    return undefined
  }

  return flags[0]
}

// Create Flag
interface ICreateFlagRequestParams {
  name: string
  description?: string
}

async function createFlag({ name, description = '' }: ICreateFlagRequestParams): Promise<IFlag> {
  const organization = store.getState().configuration.organization as IOrganization
  const project = store.getState().configuration.project as IProject

  const createdAt = Timestamp.now()

  const environments = await EnvironmentsApi.getEnvironments()
  const defaultEnvironments = environments.map((environment: IEnvironment) => ({ ...environment, enabled: false }))
  const dbEnvironments = environments.map((environment: IEnvironment) => ({ id: environment.id, enabled: false }))

  const newFlag = {
    name,
    organizationId: organization.id,
    projectId: project.id,
    description,
    environments: dbEnvironments,
    createdAt,
  }

  const newFlagDoc = await addDoc(collection(getFirestore(), FirestoreCollection.flags), newFlag)

  return { ...newFlag, environments: defaultEnvironments, id: newFlagDoc.id }
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

  // Update
  updateFlag,

  // Delete
  deleteFlag,
  deleteProjectFlags,
}

export default FlagsApi
