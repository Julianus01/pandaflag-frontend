import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'
import { ApiCollection } from './ApiCollection'

export interface IProject {
  id: string
  name: string
}

async function getProjects(): Promise<IProject[]> {
  const querySnapshot = await getDocs(query(collection(getFirestore(), ApiCollection.projects)))
  const projects: IProject[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data()) as IProject[]

  return projects
}

const ProjectsApi = {
  getProjects
}

export default ProjectsApi