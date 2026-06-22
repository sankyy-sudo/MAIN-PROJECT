import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import './index.css'
import AppRoutes from './routes/AppRoutes'
import { initThirdPartyIntegrations } from './services/integrations'
import { store } from './store'
import theme from './theme'

initThirdPartyIntegrations()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
