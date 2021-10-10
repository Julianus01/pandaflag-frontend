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
} from 'firebase/firestore'
import LSUtils from 'utils/LSUtils'
import { ApiCollection } from './ApiCollection'

export type IEnvironment = string

export interface IProject {
  id: string
  name: string
  members: IMember[]
  environments: IEnvironment[]
  createdAt: number
}

export interface IMember {
  id: string;
  type: MemberType;
}

export enum MemberType {
  admin = "admin",
}

// Get Projects
async function getProjects(): Promise<IProject[]> {
  const user = LSUtils.globalUser()

  const memberQueryValue = { id: user.id, type: 'admin' }
  const querySnapshot = await getDocs(query(collection(getFirestore(), ApiCollection.projects), where('members', 'array-contains', memberQueryValue)))
  const projects: IProject[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id, createdAt: data.createdAt.seconds }
  }) as IProject[]

  return projects
}


// Create Project
export type ICreateProjectResponse = IProject

async function createProject(name: string): Promise<IProject> {
  const user = LSUtils.globalUser()
  const createdAt = Timestamp.now()
  const newProject = { name, members: [{ id: user.id, type: MemberType.admin }], environments: ['production', 'development'], createdAt }
  const newProjectDoc = await addDoc(collection(getFirestore(), ApiCollection.projects), newProject);

  return { ...newProject, id: newProjectDoc.id, createdAt: createdAt.seconds }
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