import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import RoutePage from './RoutePage'

// Pages
import EmailVerificationPage from '../pages/EmailVerificationPage'
import LoginPage from '../pages/LoginPage'

// Custom Routes
import AuthenticatedRoute from './AuthenticatedRoute'
import EmailVerificationRoute from './EmailVerificationRoute'
import RedirectAuthenticatedRoute from './RedirectAuthenticatedRoute'
import FlagsPage from 'components/pages/FlagsPage'
import ProjectsPage from 'components/pages/ProjectsPage'
import FlagPage from 'components/pages/FlagPage'
import ProfilePage from 'components/pages/ProfilePage'
import CreateFirstProjectPage from 'components/pages/CreateFirstProjectPage'
import CreateFirstProjectRoute from './CreateFirstProjectRoute'
import OrganizationPage from 'components/pages/OrganizationPage'
import RegisterPage from 'components/pages/RegisterPage'
import ForgotPasswordPage from 'components/pages/ForgotPasswordPage'
import EnvironmentsPage from 'components/pages/EnvironmentsPage'
import FeedbackPage from 'components/pages/FeedbackPage'
import CreateOrganizationRoute from './CreateOrganizationRoute'
import CreateOrganizationPage from 'components/pages/CreateOrganizationPage'
import AcceptInvitationPage from 'components/pages/AcceptInvitationPage'
import MembersPage from 'components/pages/MembersPage'
import NotFoundPage from 'components/pages/NotFoundPage'
import { useFlag } from 'pandaflag-react'
import { FeatureFlag } from 'utils/CommonUtils'

function Routes() {
  const feedbackFlagData = useFlag(FeatureFlag.feedbackPage)

  return (
    <Router>
      <Switch>
        {/* Redirect to App if Authenticated */}
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.root()} />
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.login()} />
        <RedirectAuthenticatedRoute component={RegisterPage} exact path={RoutePage.register()} />
        <RedirectAuthenticatedRoute component={ForgotPasswordPage} exact path={RoutePage.forgotPassword()} />
        <RedirectAuthenticatedRoute
          component={AcceptInvitationPage}
          exact
          path={RoutePage.acceptInvitation(':orgId')}
        />

        {/* Authenticated routes */}
        <AuthenticatedRoute component={FlagsPage} exact path={RoutePage.flags()} />
        <AuthenticatedRoute component={FlagPage} exact path={RoutePage.flag(':name')} />

        <AuthenticatedRoute component={ProjectsPage} exact path={RoutePage.projects()} />
        <AuthenticatedRoute component={EnvironmentsPage} exact path={RoutePage.environments()} />
        <AuthenticatedRoute component={OrganizationPage} exact path={RoutePage.organization()} />
        <AuthenticatedRoute component={ProfilePage} exact path={RoutePage.profile()} />

        {feedbackFlagData.flag?.enabled && (
          <AuthenticatedRoute component={FeedbackPage} exact path={RoutePage.feedback()} />
        )}

        {/* Members */}
        <AuthenticatedRoute component={MembersPage} exact path={RoutePage.members()} />

        {/* Use case routes */}
        <EmailVerificationRoute component={EmailVerificationPage} exact path={RoutePage.emailVerification()} />

        <CreateFirstProjectRoute component={CreateFirstProjectPage} exact path={RoutePage.createFirstProject()} />
        <CreateOrganizationRoute component={CreateOrganizationPage} exact path={RoutePage.createOrganization()} />

        {/* Not Found */}
        <Route component={NotFoundPage} exact path={RoutePage.notFound()} />

        {/* Redirect to root */}
        <Route component={() => <Redirect to={RoutePage.root()} />} exact path="/*" />
      </Switch>
    </Router>
  )
}

export default Routes
