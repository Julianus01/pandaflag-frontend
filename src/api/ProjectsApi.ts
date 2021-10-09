import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  where
} from 'firebase/firestore'
import LSUtils from 'utils/LSUtils'
import { ApiCollection } from './ApiCollection'

export interface IProject {
  id: string
  name: string
  members: IMember[]
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
export interface ICreateProjectRequestParams {
  creatorId: string
  name: string
}

export type ICreateProjectResponse = IProject

async function createProject({ creatorId, name }: ICreateProjectRequestParams): Promise<IProject> {
  const newProjectDoc = await addDoc(collection(getFirestore(), ApiCollection.projects), { name, members: [creatorId] });

  return { id: newProjectDoc.id, name, members: [creatorId] }
}

const ProjectsApi = {
  getProjects,
  createProject
}

export default ProjectsApi