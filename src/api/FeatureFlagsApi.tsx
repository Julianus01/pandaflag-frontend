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

export interface IFeatureFlag {
  id: string
  projectId: string
  name: string
  environment: IEnvironment
  createdAt: number
}

// Get Feature Flags
async function getFeatureFlags(): Promise<IFeatureFlag[]> {
  const project = store.getState().configuration.project as IProject

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), ApiCollection.featureFlags),
      where('projectId', '==', project.id),
      orderBy('createdAt', 'desc')
    )
  )

  const featureFlags = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id, createdAt: data.createdAt.seconds }
  }) as IFeatureFlag[]

  return featureFlags
}

// Create Feature Flag
export type ICreateProjectResponse = IFeatureFlag

async function createFeatureFlag(name: string): Promise<IFeatureFlag> {
  const project = store.getState().configuration.project as IProject
  const environment = store.getState().configuration.environment as IEnvironment
  const createdAt = Timestamp.now()

  const newFeatureFlag = {
    name,
    projectId: project.id,
    environment,
    createdAt,
  }

  const newFeatureFlagDoc = await addDoc(collection(getFirestore(), ApiCollection.featureFlags), newFeatureFlag)

  return { ...newFeatureFlag, id: newFeatureFlagDoc.id, createdAt: createdAt.seconds }
}

// Delete Feature Flag
async function deleteFeatureFlag(featureFlagId: string): Promise<void> {
  return deleteDoc(doc(getFirestore(), ApiCollection.featureFlags, featureFlagId));
}

const FeatureFlagsApi = {
  getFeatureFlags,
  createFeatureFlag,
  deleteFeatureFlag
}

export default FeatureFlagsApi
