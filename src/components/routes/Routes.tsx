import { BrowserRouter as Router, Switch } from 'react-router-dom'
import RoutePage from './RoutePage'

// Pages
import DashboardPage from '../pages/DashboardPage'
import EmailVerificationPage from '../pages/EmailVerificationPage'
import LoginPage from '../pages/LoginPage'

// Custom Routes
import AuthenticatedRoute from './AuthenticatedRoute'
import EmailVerificationRoute from './EmailVerificationRoute'
import RedirectAuthenticatedRoute from './RedirectAuthenticatedRoute'

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Redirect to App if Authenticated */}
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.root()} />
        <RedirectAuthenticatedRoute component={LoginPage} exact path={RoutePage.login()} />

        {/* Authenticated routes */}
        <AuthenticatedRoute component={DashboardPage} exact path={RoutePage.dashboard()} />
        <EmailVerificationRoute component={EmailVerificationPage} exact path={RoutePage.emailVerification()} />
      </Switch>
    </Router>
  )
}

export default Routes
