import { AuthError, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth'

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

    await createUserWithEmailAndPassword(auth, email, password)
  } catch (err) {
    const error: AuthError = err as AuthError
    throw new Error(authErrorMessage(error.code as FirebaseAuthErrorCode))
  }
}

const AuthApi = {
  loginInWithEmailAndPassword,
  createAccountWithEmailAndPassword,
}

export default AuthApi
