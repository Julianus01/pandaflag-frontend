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
  name: string
  color: string
}

export const EmptyEnvironment = {
  production: { name: 'production', color: 'orange' },
  development: { name: 'development', color: 'blue' },
}

export interface IProject {
  id: string
  organizationId: string
  name: string
  environments: IEnvironment[]
  apiKey: string
  createdAt: Timestamp
}

// Get Projects
async function getProjects(): Promise<IProject[]> {
  const organization = store.getState().configuration.organization

  if (!organization) {
    return []
  }

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.projects),
      where('organizationId', '==', organization.id),
      orderBy('createdAt', 'desc')
    )
  )

  const projects = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IProject[]

  return projects
}

async function getProjectsByOrganizationId(organizationId: string): Promise<IProject[]> {
  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.projects),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc')
    )
  )

  const projects = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IProject[]

  return projects
}

// Create Project
async function createProject(name: string): Promise<IProject> {
  const organization = store.getState().configuration.organization as IOrganization
  const createdAt = Timestamp.now()

  const newProject = {
    name,
    organizationId: organization.id,
    environments: [EmptyEnvironment.production, EmptyEnvironment.development],
    apiKey: uuidv4(),
    createdAt,
  }
  const newProjectDoc = await addDoc(collection(getFirestore(), FirestoreCollection.projects), newProject)

  return { ...newProject, id: newProjectDoc.id }
}

interface ICreateFirstProjectParams {
  name: string
  organizationId: string
}

async function createFirstProject({ name, organizationId }: ICreateFirstProjectParams): Promise<IProject> {
  const createdAt = Timestamp.now()

  const newProject = {
    name,
    organizationId: organizationId,
    environments: [EmptyEnvironment.production, EmptyEnvironment.development],
    apiKey: uuidv4(),
    createdAt,
  }
  const newProjectDoc = await addDoc(collection(getFirestore(), FirestoreCollection.projects), newProject)

  return { ...newProject, id: newProjectDoc.id }
}

// Update Project
export interface IUpdateProjectRequestParams extends Partial<IProject> {
  id: string
}

async function updateProject({ id, ...updates }: IUpdateProjectRequestParams): Promise<void> {
  return setDoc(doc(getFirestore(), FirestoreCollection.projects, id), updates, { merge: true })
}

// Delete Project
async function deleteProject(projectId: string): Promise<void> {
  await Promise.all([
    deleteDoc(doc(getFirestore(), FirestoreCollection.projects, projectId)),
    FlagsApi.deleteProjectFlags(projectId),
  ])
}

const ProjectsApi = {
  // Get
  getProjects,
  getProjectsByOrganizationId,

  // Create
  createProject,
  createFirstProject,

  // Update
  updateProject,

  // Delete
  deleteProject,
}

export default ProjectsApi
