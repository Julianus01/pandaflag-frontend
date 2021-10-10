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
import SettingsPage from 'components/pages/SettingsPage'
import CreateFirstProjectPage from 'components/pages/CreateFirstProjectPage'
import CreateFirstProjectRoute from './CreateFirstProjectRoute'
import ProjectsPage from 'components/pages/ProjectsPage'
import DashboardPage from 'components/pages/DashboardPage'

function Routes() {
  return (
    <Router>
      <Switch>
        {/* Redirect to App if Authenticated */}
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.root()} />
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.login()} />

        {/* Authenticated routes */}
        <AuthenticatedRoute component={DashboardPage} exact path={RoutePage.dashboard()} />
        <AuthenticatedRoute component={FlagsPage} exact path={RoutePage.flags()} />
        <AuthenticatedRoute component={SettingsPage} exact path={RoutePage.settings()} />
        <AuthenticatedRoute component={ProjectsPage} exact path={RoutePage.projects()} />

        {/* Use case routes */}
        <EmailVerificationRoute component={EmailVerificationPage} exact path={RoutePage.emailVerification()} />
        <CreateFirstProjectRoute component={CreateFirstProjectPage} exact path={RoutePage.createFirstProject()} />

        {/* Redirect to root */}
        <Route component={() => <Redirect to={RoutePage.root()} />} exact={true} path="/*" />
      </Switch>
    </Router>
  )
}

export default Routes
