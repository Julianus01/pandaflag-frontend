import {
  collection,
  getFirestore,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import { IUser } from 'redux/ducks/authDuck'
import store from 'redux/store'
import { FirestoreCollection } from './FirestoreCollection'
import ProjectsApi from './ProjectsApi'
import { IMemberRelation, MemberType } from './UsersApi'

const BaseUrl = process.env.REACT_APP_PANDAFLAG_API_URL as string

export interface IOrganization {
  id: string
  name: string
  members: IMemberRelation[]
  createdAt: Timestamp
  customerId?: string
}

// Get Organization
interface IGetOrganizationWhereTypeParams {
  userId?: string
  memberType: MemberType
}

async function getOrganizationWhereType(params: IGetOrganizationWhereTypeParams): Promise<IOrganization | undefined> {
  const userId = params.userId || store.getState().auth.user?.uid
  const memberQueryValue = { id: userId, type: params.memberType }

  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), FirestoreCollection.organizations),
      where('members', 'array-contains', memberQueryValue)
    )
  )

  if (querySnapshot.empty) {
    return undefined
  }

  const [organization] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data()
    return { ...data, id: doc.id }
  }) as IOrganization[]

  return organization
}

async function getOrganization(userId?: string): Promise<IOrganization | undefined> {
  const uid = userId || store.getState().auth.user?.uid

  const [adminOrganization, memberOrganization] = await Promise.all([
    getOrganizationWhereType({ memberType: MemberType.admin, userId: uid }),
    getOrganizationWhereType({ memberType: MemberType.member, userId: uid }),
  ])

  if (adminOrganization) {
    return adminOrganization
  }

  if (memberOrganization) {
    return memberOrganization
  }

  return undefined
}

async function getOrganizationById(id: string): Promise<IOrganization | undefined> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.organizations, id))

  if (!snapshot.exists()) {
    return undefined
  }

  return { id, ...snapshot.data() } as IOrganization
}

// Create Organization
async function createOrganization(name: string): Promise<IOrganization> {
  const user = store.getState().auth.user as IUser
  const createdAt = Timestamp.now()

  const newOrganization = {
    name,
    members: [{ id: user.uid, type: MemberType.admin }],
    createdAt,
  }

  const newOrganizationDoc = await addDoc(
    collection(getFirestore(), FirestoreCollection.organizations),
    newOrganization
  )

  return { ...newOrganization, id: newOrganizationDoc.id }
}

// Update Organization
export interface IUpdateOrganizationRequestParams extends Partial<IOrganization> {
  id: string
}

async function updateOrganization({ id, ...updates }: IUpdateOrganizationRequestParams): Promise<void> {
  return setDoc(doc(getFirestore(), FirestoreCollection.organizations, id), updates, { merge: true })
}

async function leaveOrganization() {
  const user = store.getState().auth.user
  const organization = store.getState().configuration.organization as IOrganization
  const isNotLastMember = organization?.members?.length > 1

  if (isNotLastMember) {
    const organizationWithoutCurrentUser: IOrganization = {
      ...organization,
      members: organization.members.filter((memberRelation) => memberRelation.id !== user?.uid),
    }

    return await updateOrganization(organizationWithoutCurrentUser)
  }

  await deleteOrganization()
}

async function deleteOrganization(): Promise<void> {
  const organization = store.getState().configuration.organization as IOrganization

  const projects = await ProjectsApi.getProjects()
  const deleteProjectsPromises = projects.map((project) => ProjectsApi.deleteProject(project.id))

  await Promise.all([
    deleteDoc(doc(getFirestore(), FirestoreCollection.organizations, organization.id)),
    ...deleteProjectsPromises,
  ])
}

interface ICanInviteMemberResponse {
  canInvite: boolean
}

async function canInviteMember(orgId: string): Promise<ICanInviteMemberResponse> {
  const response = await fetch(`${BaseUrl}/can-invite-member/${orgId}`, {
    headers: {
      'Content-type': 'application/json',
    },
  })

  const json = await response.json()
  return json as ICanInviteMemberResponse
}

const OrganizationsApi = {
  // Get
  getOrganization,
  getOrganizationById,
  canInviteMember,

  // Create
  createOrganization,

  // Update
  updateOrganization,

  // Delete
  leaveOrganization,
  deleteOrganization,
}

export default OrganizationsApi
