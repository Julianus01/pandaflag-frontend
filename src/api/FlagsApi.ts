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
import EnvironmentsApi, { IDbEnvironment, IEnvironment, IFlagEnvironment } from './EnvironmentsApi'
import { FirestoreCollection } from './FirestoreCollection'
import { IOrganization } from './OrganizationsApi'
import { IProject } from './ProjectsApi'

export interface IFlag {
  id: string
  organizationId: string
  projectId: string
  name: string
  description?: string
  environments: IEnvironment[]
  createdAt: Timestamp
}

// Get Flags
async function getFlags(): Promise<IFlag[]> {
  const project = store.getState().configuration.project as IProject
  const [dbEnvironments, querySnapshot] = await Promise.all([
    EnvironmentsApi.getEnvironments(),
    getDocs(query(collection(getFirestore(), FirestoreCollection.flags), where('projectId', '==', project.id))),
  ])

  const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data() as IFlag

    const flagEnvironments: IEnvironment[] = data.environments.map((flagEnvironment: IFlagEnvironment) => {
      const found = dbEnvironments.find((environment: IDbEnvironment) => environment.id === flagEnvironment.id)
      return { ...found, enabled: flagEnvironment.enabled }
    }) as IEnvironment[]

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

  const [dbEnvironments, querySnapshot] = await Promise.all([
    EnvironmentsApi.getEnvironments(),
    getDocs(
      query(
        collection(getFirestore(), FirestoreCollection.flags),
        where('projectId', '==', project.id),
        where('name', '==', name)
      )
    ),
  ])

  const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IFlag[]

  if (!flags.length) {
    return undefined
  }

  const flag = flags[0]
  const flagEnvironments = flag.environments.map((flagEnvironment: IFlagEnvironment) => {
    const found = dbEnvironments.find((dbEnvironment: IDbEnvironment) => dbEnvironment.id === flagEnvironment.id)
    return { ...found, enabled: flagEnvironment.enabled }
  }) as IEnvironment[]

  return { ...flag, environments: flagEnvironments }
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
  const defaultEnvironments = environments.map((environment: IDbEnvironment) => ({ ...environment, enabled: false }))
  const dbEnvironments = environments.map((environment: IDbEnvironment) => ({ id: environment.id, enabled: false }))

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
  const flag = await getFlag(id)

  if (!flag) {
    throw new Error(`Flag with the given id doesn't exist`)
  }

  let newUpdates = { ...updates }
  // Map Environments for DB format
  if (newUpdates?.environments) {
    newUpdates = {
      ...newUpdates,
      environments: newUpdates.environments.map((environment: IEnvironment) => ({
        id: environment.id,
        enabled: environment.enabled,
      })) as any,
    }
  }

  return setDoc(doc(getFirestore(), FirestoreCollection.flags, id), newUpdates, { merge: true })
}

// Delete Flag
async function deleteFlag(flagId: string): Promise<void> {
  await deleteDoc(doc(getFirestore(), FirestoreCollection.flags, flagId))
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

async function addEnvironmentToFlags(environment: IEnvironment) {
  const flags = await getFlags()
  const flagsUpdatePromises = flags.map((flag) =>
    updateFlag({
      id: flag.id,
      environments: [...flag.environments, { ...environment, enabled: false }],
    })
  )

  await Promise.all(flagsUpdatePromises)
}

async function removeEnvironmentFromFlags(environmentId: string): Promise<void> {
  const flags = await getFlags()

  console.log('Get flags')
  console.log(flags)

  const flagsWithEnvironmentRemoved = flags.map((flag) => {
    const newEnvironments = flag.environments.filter((environment) => environment.id !== environmentId)

    console.log('New envs for flag')
    console.log(newEnvironments)

    return { ...flag, environments: newEnvironments }
  })

  console.log('New flags with env removed')
  console.log(flagsWithEnvironmentRemoved)

  const newFlags = flagsWithEnvironmentRemoved.map((flag) => ({ id: flag.id, environments: flag.environments }))

  console.log('New Flags')
  console.log(newFlags)

  const flagsUpdatePromises = flagsWithEnvironmentRemoved.map((flag) =>
    updateFlag({ id: flag.id, environments: flag.environments })
  )
  await Promise.all(flagsUpdatePromises)
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

  // Helpers
  addEnvironmentToFlags,
  removeEnvironmentFromFlags,
}

export default FlagsApi
