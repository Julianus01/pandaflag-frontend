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
  doc
} from 'firebase/firestore'
import LSUtils from 'utils/LSUtils'
import { ApiCollection } from './ApiCollection'

export type IEnvironment = string

export interface IProject {
  id: string
  name: string
  members: IMember[]
  environments: IEnvironment[]
}

export type IMember = string

export enum MemberType {
  admin = "admin",
  member = "member"
}

// Get Projects
async function getProjects(): Promise<IProject[]> {
  const user = LSUtils.globalUser()
  const querySnapshot = await getDocs(query(collection(getFirestore(), ApiCollection.projects), where('members', 'array-contains', user.id)))
  const projects: IProject[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() })) as IProject[]

  return projects
}


// Create Project
export type ICreateProjectResponse = IProject

async function createProject(name: string): Promise<IProject> {
  const user = LSUtils.globalUser()
  const newProjectDoc = await addDoc(collection(getFirestore(), ApiCollection.projects), { name, members: [user.id], environments: ['production', 'staging', 'development'] });

  return { id: newProjectDoc.id, name, members: [user.id], environments: ['production', 'staging', 'development'] }
}

// Delete Project

async function deleteProject(projectId: string): Promise<void> {
  return deleteDoc(doc(getFirestore(), ApiCollection.projects, projectId));
}

const ProjectsApi = {
  getProjects,
  createProject,
  deleteProject
}

export default ProjectsApi