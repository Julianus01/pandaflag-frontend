import { useEffect } from 'react'

function removeAuthLocalStorage() {
  localStorage.removeItem(
    `@@auth0spajs@@::${process.env.REACT_APP_AUTH0_CLIENT_ID}::default::openid profile email offline_access`
  )
}

function EmailVerificationPage() {
  useEffect(() => {
    removeAuthLocalStorage()
  }, [])

  return <div>You need to verify your email</div>
}

export default EmailVerificationPage
