import { getFirestore, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { FirestoreCollection } from './FirestoreCollection'
import { IUser } from 'redux/ducks/authDuck'

async function upsertUser(user: IUser): Promise<void> {
  await setDoc(doc(getFirestore(), FirestoreCollection.users, user.uid), user, { merge: true })
}

async function addUserIfDoesntExist(user: IUser): Promise<void> {
  const snapshot = await getDoc(doc(getFirestore(), FirestoreCollection.users, user.uid))

  if (snapshot.exists()) {
    return
  }

  const newUser = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  const newUserDoc = await setDoc(doc(getFirestore(), FirestoreCollection.users, user.uid), newUser)
  return newUserDoc
}

const UsersApi = {
  // Create
  addUserIfDoesntExist,

  // Upsert
  upsertUser,
}

export default UsersApi
