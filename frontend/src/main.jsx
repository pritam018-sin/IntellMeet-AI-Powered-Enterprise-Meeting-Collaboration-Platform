import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
        <SocketProvider>
          <App />
        </SocketProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)