export enum SplitbeeEvent {
  // Auth
  Login = 'Login',
  LoginWithGoogle = 'Login with Google',
  Register = 'Register',

  // Feedback
  SendFeedback = 'Send Feedback',

  // Flags
  CreateFlag = 'Create Flag',
  DeleteFlag = 'Delete Flag',
  ToggleFlagStatus = 'Toggle Flag Status',

  // Environments
  CreateEnvironment = 'Create Environment',
  UpdateEnvironment = 'Update Environment',
  DeleteEnvironment = 'Delete Environment',

  // Try Api
  CopyTryApiCode = 'Copy Try Api code',
  RunTryApi = 'Run Try Api',

  // Members
  InviteMember = 'Invite Member',
}
