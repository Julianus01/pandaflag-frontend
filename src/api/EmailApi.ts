import store from 'redux/store'
import emailjs from '@emailjs/browser'
import { IUser } from 'redux/ducks/authDuck'

enum EmailTemplateId {
  Feedback = 'template_i9io4db',
}

export interface ISendFeedbackEmailParams {
  title: string
  message: string
}

async function sendFeedbackEmail(params: ISendFeedbackEmailParams) {
  const user = store.getState().auth.user as IUser

  return emailjs.send(
    process.env.REACT_APP_EMAIL_JS_SERVICE_ID as string,
    EmailTemplateId.Feedback,
    {
      title: params.title,
      fromEmail: user.email,
      message: params.message,
    },
    process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY
  )
}

const EmailApi = {
  sendFeedbackEmail,
}

export default EmailApi
