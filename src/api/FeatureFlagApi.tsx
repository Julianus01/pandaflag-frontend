import {
  collection,
  query,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  where,
  orderBy,
} from 'firebase/firestore'
import LSUtils from 'utils/LSUtils'
import { ApiCollection } from './ApiCollection'

export interface IFeatureFlag {
  id: string
  projectId: string
  name: string
  createdAt: number
}

// Get Projects
async function getFeatureFlags() {
  // const memberQueryValue = { id: user.id, type: 'admin' }
  // const querySnapshot = await getDocs(
  //   query(
  //     collection(getFirestore(), ApiCollection.projects),
  //     where('members', 'array-contains', memberQueryValue),
  //     orderBy('createdAt', 'desc')
  //   )
  // )
  // // const querySnapshot = await getDocs(query(collection(getFirestore(), ApiCollection.projects), where('members', 'array-contains', memberQueryValue)))
  // const projects: IFeatureFlag[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
  //   const data = doc.data()
  //   return { ...data, id: doc.id, createdAt: data.createdAt.seconds }
  // }) as IFeatureFlag[]
  // return projects
}

// // Create Project
// export type ICreateProjectResponse = IProject

// async function createProject(name: string): Promise<IProject> {
//   const user = LSUtils.globalUser()
//   const createdAt = Timestamp.now()
//   const newProject = { name, members: [{ id: user.id, type: MemberType.admin }], environments: ['production', 'development'], createdAt }
//   const newProjectDoc = await addDoc(collection(getFirestore(), ApiCollection.projects), newProject);

//   return { ...newProject, id: newProjectDoc.id, createdAt: createdAt.seconds }
// }

// // Delete Project
// async function deleteProject(projectId: string): Promise<void> {
//   return deleteDoc(doc(getFirestore(), ApiCollection.projects, projectId));
// }

const ProjectsApi = {
  getFeatureFlags,
  // createProject,
  // deleteProject
}

export default ProjectsApi
