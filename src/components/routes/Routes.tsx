import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import RoutePage from './RoutePage'

// Pages
import DashboardPage from '../pages/DashboardPage'
import EmailVerificationPage from '../pages/EmailVerificationPage'
import LoginPage from '../pages/LoginPage'

// Custom Routes
import AuthenticatedRoute from './AuthenticatedRoute'
import EmailVerificationRoute from './EmailVerificationRoute'
import RedirectAuthenticatedRoute from './RedirectAuthenticatedRoute'
import FeatureFlagsPage from 'components/pages/FeatureFlagsPage'
import SettingsPage from 'components/pages/SettingsPage'
import CreateFirstProjectPage from 'components/pages/CreateFirstProjectPage'
import CreateFirstProjectRoute from './CreateFirstProjectRoute'

function Routes() {
  return (
    <Router>
      <Switch>
        {/* Redirect to App if Authenticated */}
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.root()} />
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.login()} />

        {/* Email Verification */}
        <EmailVerificationRoute component={EmailVerificationPage} exact path={RoutePage.emailVerification()} />

        {/* Authenticated routes */}
        <AuthenticatedRoute component={DashboardPage} exact path={RoutePage.dashboard()} />
        <AuthenticatedRoute component={FeatureFlagsPage} exact path={RoutePage.featureFlags()} />
        <AuthenticatedRoute component={SettingsPage} exact path={RoutePage.settings()} />
        <CreateFirstProjectRoute component={CreateFirstProjectPage} exact path={RoutePage.createFirstProject()} />

        {/* Redirect to root */}
        <Route component={() => <Redirect to={RoutePage.root()} />} exact={true} path="/*" />
      </Switch>
    </Router>
  )
}

export default Routes
