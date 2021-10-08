import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
} from 'firebase/firestore'
import { ApiCollection } from './ApiCollection'

export interface IProject {
  id: string
  name: string
}

async function getProjects(): Promise<IProject[]> {
  const querySnapshot = await getDocs(query(collection(getFirestore(), ApiCollection.projects)))
  const projects: IProject[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() })) as IProject[]

  return projects
}

async function createProject(name: string): Promise<IProject> {
  const newProjectDoc = await addDoc(collection(getFirestore(), ApiCollection.projects), { name });

  return { id: newProjectDoc.id, name }
}

const ProjectsApi = {
  getProjects,
  createProject
}

export default ProjectsApi