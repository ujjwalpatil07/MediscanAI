import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import { PatientProvider } from './context/PatientProvider.jsx';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthProvider.jsx';
import { SocketProvider } from './context/SocketProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider>
              <PatientProvider>
                <App />
              </PatientProvider>
            </ThemeProvider>
          </SnackbarProvider>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
