import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  where,
  orderBy,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import store from 'redux/store'
import { ApiCollection } from './ApiCollection'
import { IEnvironment, IProject } from './ProjectsApi'

export interface IFlag {
  id: string
  projectId: string
  name: string
  environment: IEnvironment
  createdAt: number
}

// Get Feature Flags
async function getFlags(): Promise<IFlag[]> {
  const project = store.getState().configuration.project as IProject

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), ApiCollection.flags),
      where('projectId', '==', project.id),
      orderBy('createdAt', 'desc')
    )
  )

  const flags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id, createdAt: data.createdAt.seconds }
  }) as IFlag[]

  return flags
}

// Create Feature Flag
export type ICreateProjectResponse = IFlag

async function createFlag(name: string): Promise<IFlag> {
  const project = store.getState().configuration.project as IProject
  const environment = store.getState().configuration.environment as IEnvironment
  const createdAt = Timestamp.now()

  const newFlag = {
    name,
    projectId: project.id,
    environment,
    createdAt,
  }

  const newFlagDoc = await addDoc(collection(getFirestore(), ApiCollection.flags), newFlag)

  return { ...newFlag, id: newFlagDoc.id, createdAt: createdAt.seconds }
}

// Delete Feature Flag
async function deleteFlag(flagId: string): Promise<void> {
  return deleteDoc(doc(getFirestore(), ApiCollection.flags, flagId));
}

const FlagsApi = {
  getFlags,
  createFlag,
  deleteFlag
}

export default FlagsApi
