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
import { FirestoreCollection } from './FirestoreCollection'
import { IEnvironment, IProject } from './ProjectsApi'

export interface IFlag {
  id: string
  projectId: string
  name: string
  enabled: boolean
  environmentName: string
  createdAt: number
}

// Get Flags
async function getFlags(): Promise<IFlag[]> {
  const project = store.getState().configuration.project as IProject
  const environment = store.getState().configuration.environment as IEnvironment

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.flags),
      where('projectId', '==', project.id),
      where('environmentName', '==', environment.name)
    )
  )

  const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id, createdAt: data.createdAt.seconds }
  }) as IFlag[]

  return flags.sort((a, b) => a.name.localeCompare(b.name))
}

async function getFlag(id: string): Promise<IFlag> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.flags, id))
  return { id, ...snapshot.data() } as IFlag
}

// Create Flag
async function createFlag(name: string): Promise<IFlag> {
  const project = store.getState().configuration.project as IProject
  const environment = store.getState().configuration.environment as IEnvironment
  const createdAt = Timestamp.now()

  const newFlag = {
    name,
    projectId: project.id,
    enabled: false,
    environmentName: environment.name,
    createdAt,
  }

  const newFlagDoc = await addDoc(collection(getFirestore(), FirestoreCollection.flags), newFlag)

  return { ...newFlag, id: newFlagDoc.id, createdAt: createdAt.seconds }
}

async function createFlagForAllEnvironments(
  name: string
): Promise<[DocumentReference<DocumentData>, DocumentReference<DocumentData>]> {
  const project = store.getState().configuration.project as IProject
  const createdAt = Timestamp.now()

  const newFlag = {
    name,
    projectId: project.id,
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
