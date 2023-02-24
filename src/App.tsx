import { ThemeProvider } from 'styled-components'
import { Router } from './Router'
import { BrowserRouter } from 'react-router-dom'

import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'
import { CyclesContextProvider } from './contexts/CycleContext'

export function App() {
  return (
    // theme={} indica o tema que será utilizado
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}
