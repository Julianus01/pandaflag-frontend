import store from 'redux/store'
import emailjs from '@emailjs/browser'
import { IUser } from 'redux/ducks/authDuck'
import RoutePage from 'components/routes/RoutePage'

enum EmailTemplateId {
  Feedback = 'template_i9io4db',
  MemberInvitation = 'template_xek26lo',
}

function generateInvitationLink(invitationId: string) {
  return `${process.env.REACT_APP_PANDAFLAG_APP_URL}${RoutePage.acceptInvitation(invitationId)}`
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

async function sendMemberInvitation(email: string, invitationId: string) {
  const organization = store.getState().configuration.organization

  return emailjs.send(
    process.env.REACT_APP_EMAIL_JS_SERVICE_ID as string,
    EmailTemplateId.MemberInvitation,
    {
      organization: organization?.name,
      toEmail: email,
      invitationLink: generateInvitationLink(invitationId),
    },
    process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY
  )
}

const EmailApi = {
  sendFeedbackEmail,
  sendMemberInvitation,
}

export default EmailApi
