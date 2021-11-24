import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { FirestoreCollection } from './FirestoreCollection'
import { IUser } from 'redux/ducks/authDuck'

// Upsert User
async function upsertUser(user: IUser): Promise<void> {
  await setDoc(doc(getFirestore(), FirestoreCollection.users, user.uid), user, { merge: true })
}

const UsersApi = {
  // Upsert
  upsertUser,
}

export default UsersApi
