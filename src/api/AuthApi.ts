import {
  AuthError,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth'
import { IUser } from 'redux/ducks/authDuck'

enum FirebaseAuthErrorCode {
  emailAlreadyExists = 'auth/email-already-exists',
  userNotFound = 'auth/user-not-found',
  wrongPassword = 'auth/wrong-password',
  emailAlreadyInUse = 'auth/email-already-in-use',
}

export interface IAuthError {
  message: string
}

function authErrorMessage(errorCode: FirebaseAuthErrorCode) {
  switch (errorCode) {
    case FirebaseAuthErrorCode.emailAlreadyExists:
      return `An account with this email already exists`

    case FirebaseAuthErrorCode.userNotFound:
      return `An account with this email address doesn't exist`

    case FirebaseAuthErrorCode.wrongPassword:
      return `Your email or password is incorrect`

    case FirebaseAuthErrorCode.emailAlreadyInUse:
      return `An account with this email already exists`

    default:
      return 'Internal server error'
  }
}

async function loginInWithEmailAndPassword(email: string, password: string) {
  try {
    const auth = getAuth()

    await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

async function createAccountWithEmailAndPassword(email: string, password: string) {
  try {
    const auth = getAuth()

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

async function loginWithGoogleCredential() {
  try {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    const userCredential = await signInWithPopup(auth, provider)
    return userCredential
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

async function sendVerificationEmail() {
  try {
    const auth = getAuth()
    await sendEmailVerification(auth.currentUser as IUser)
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

async function sendPasswordReset(email: string) {
  try {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

async function logout() {
  try {
    const auth = getAuth()
    await signOut(auth)
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

const AuthApi = {
  loginInWithEmailAndPassword,
  loginWithGoogleCredential,
  createAccountWithEmailAndPassword,
  sendVerificationEmail,
  sendPasswordReset,
  logout,
}

export default AuthApi
