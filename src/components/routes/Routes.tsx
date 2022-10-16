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
import GaTracking from 'components/shared/GaTracking'
import FeedbackPage from 'components/pages/FeedbackPage'

function Routes() {
  return (
    <Router>
      {/* Google Analytics */}
      <GaTracking />

      <Switch>
        {/* Redirect to App if Authenticated */}
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.root()} />
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.login()} />
        <RedirectAuthenticatedRoute component={RegisterPage} exact path={RoutePage.register()} />
        <RedirectAuthenticatedRoute component={ForgotPasswordPage} exact path={RoutePage.forgotPassword()} />

        {/* Authenticated routes */}
        <AuthenticatedRoute component={FlagsPage} exact path={RoutePage.flags()} />
        <AuthenticatedRoute component={FlagPage} exact path={RoutePage.flag(':name')} />

        <AuthenticatedRoute component={ProjectsPage} exact path={RoutePage.projects()} />
        <AuthenticatedRoute component={EnvironmentsPage} exact path={RoutePage.environments()} />
        <AuthenticatedRoute component={OrganizationPage} exact path={RoutePage.organization()} />
        <AuthenticatedRoute component={ProfilePage} exact path={RoutePage.profile()} />
        <AuthenticatedRoute component={FeedbackPage} exact path={RoutePage.feedback()} />

        {/* Use case routes */}
        <EmailVerificationRoute component={EmailVerificationPage} exact path={RoutePage.emailVerification()} />

        <CreateFirstProjectRoute component={CreateFirstProjectPage} exact path={RoutePage.createFirstProject()} />

        {/* Redirect to root */}
        <Route component={() => <Redirect to={RoutePage.root()} />} exact path="/*" />
      </Switch>
    </Router>
  )
}

export default Routes
