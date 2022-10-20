import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import './firebase_init'
import GlobalStyles from 'components/styles/GlobalStyles'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'
import theme from 'theme/theme'
import StyledThemeProvider from 'theme/StyledThemeProvider'
import { ProjectsContextProvider } from 'context/ProjectsContext'
import ReactGA from 'react-ga'
import { EnvironmentsContextProvider } from 'context/EnvironmentsContext'
import ReactQueryProvider from 'provider/ReactQueryProvider'

// For version checking
console.log('v1.0.0')

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID as string)

let vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)

function RootHTML() {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
        <ReactQueryProvider>
          <ProjectsContextProvider>
            <EnvironmentsContextProvider>
              <GlobalStyles />
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />

              <StyledThemeProvider>
                <App />
              </StyledThemeProvider>
            </EnvironmentsContextProvider>
          </ProjectsContextProvider>
        </ReactQueryProvider>
      </ChakraProvider>
    </ReduxProvider>
  )
}

ReactDOM.render(<RootHTML />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
