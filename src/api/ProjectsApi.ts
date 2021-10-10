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
} from 'firebase/firestore'
import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
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
  const user = store.getState().auth.user as IUser
  const memberQueryValue = { id: user.sub, type: 'admin' }

  const querySnapshot = await getDocs(query(collection(getFirestore(), ApiCollection.projects), where('members', 'array-contains', memberQueryValue), orderBy('createdAt', "desc")))
  const projects = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id, createdAt: data.createdAt.seconds }
  }) as IProject[]

  return projects
}


// Create Project
export type ICreateProjectResponse = IProject

async function createProject(name: string): Promise<IProject> {
  const user = store.getState().auth.user as IUser
  const createdAt = Timestamp.now()

  const newProject = { name, members: [{ id: user.sub, type: MemberType.admin }], environments: ['production', 'development'], createdAt }
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