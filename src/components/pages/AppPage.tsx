import { useAuth0 } from '@auth0/auth0-react'

function AppPage() {
  const { logout } = useAuth0()

  return (
    <div>
      Application Page
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

export default AppPage
