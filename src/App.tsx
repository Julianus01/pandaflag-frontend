import logo from './logo.svg'
import './App.css'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { user, loginWithRedirect, logout } = useAuth0()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {user?.name && <p>{user.name}</p>}

        {!Boolean(user) && (
          <p onClick={loginWithRedirect} className="App-link">
            Login
          </p>
        )}

        <p
          onClick={() => logout({ returnTo: window.location.origin })}
          className="App-link"
        >
          Logout
        </p>
      </header>
    </div>
  )
}

export default App
