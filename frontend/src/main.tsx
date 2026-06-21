import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import AppRoutes from './routes/AppRoutes'
import { initThirdPartyIntegrations } from './services/integrations'
import { store } from './store'

initThirdPartyIntegrations()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </StrictMode>,
)
