import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import AuthenticationProvider from './components/shared/AuthenticationProvider'
import { ChakraProvider } from '@chakra-ui/react'
import './firebase_init'

function RootHTML() {
  return (
    <React.StrictMode>
      <ChakraProvider>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </ChakraProvider>
    </React.StrictMode>
  )
}

ReactDOM.render(<RootHTML />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
