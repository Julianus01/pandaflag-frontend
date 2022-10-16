import store from 'redux/store'
import { IUser } from 'redux/ducks/authDuck'
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore'
import { FirestoreCollection } from './FirestoreCollection'
import EmailApi from './EmailApi'
import ReactGa from 'react-ga'
import { GaActionFeedback, GaCategory } from 'utils/GaUtils'

export interface ISendFeedbackParams {
  title: string
  message: string
}

async function sendFeedback(params: ISendFeedbackParams) {
  const user = store.getState().auth.user as IUser
  const createdAt = Timestamp.now()

  const newFeedback = {
    email: user.email,
    title: params.title,
    message: params.message,
    createdAt,
  }

  await addDoc(collection(getFirestore(), FirestoreCollection.feedback), newFeedback)
  await EmailApi.sendFeedbackEmail({ title: params.title, message: params.message })

  ReactGa.event({
    category: GaCategory.forms,
    action: GaActionFeedback.sendFeedback,
  })
}

const FeedbackApi = {
  sendFeedback,
}

export default FeedbackApi
