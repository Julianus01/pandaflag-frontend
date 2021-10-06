import { BrowserRouter as Router, Switch } from 'react-router-dom'
import AppPage from '../pages/AppPage'
import LoginPage from '../pages/LoginPage'
import AuthenticatedRoute from './AuthenticatedRoute'
import RedirectAuthenticatedRoute from './RedirectAuthenticatedRoute'

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Redirect to App if Authenticated */}
        <RedirectAuthenticatedRoute component={LoginPage} exact path="/login" />
        <RedirectAuthenticatedRoute component={LoginPage} exact path="/" />

        {/* Authenticated routes */}
        <AuthenticatedRoute component={AppPage} exact path="/app" />
      </Switch>
    </Router>
  )
}

export default Routes
