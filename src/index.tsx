import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import AuthenticationProvider from './components/shared/AuthenticationProvider'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { ThemeProvider } from '@emotion/react'
import { initFirebase } from './firebase_init'
import GlobalStyles from 'components/styles/GlobalStyles'
import { QueryClient, QueryClientProvider } from 'react-query'

let vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)

initFirebase()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function RootHTML() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ChakraProvider>
            <GlobalStyles />

            <AuthenticationProvider>
              <App />
            </AuthenticationProvider>
          </ChakraProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

ReactDOM.render(<RootHTML />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
