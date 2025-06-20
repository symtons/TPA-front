// =============================================================================
// FIXED APP.JS WITH WORKING SESSION TIMEOUT
// File: src/App.js (Replace existing)
// =============================================================================

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import SessionTimeoutModal from './components/ui/SessionTimeoutModal';
import useSessionTimeout from './hooks/useSessionTimeout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    warning: {
      main: '#ffc107', // Yellow
      light: '#fff350',
      dark: '#ff8f00',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

// Loading component
const LoadingScreen = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #1976d2 0%, #ff9800 50%, #ffc107 100%)'
    }}
  >
    <CircularProgress size={60} sx={{ color: 'white' }} />
  </Box>
);

// Main app component with auth logic
const AppContent = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  
  // Session timeout hook - this was missing!
  const { 
    showModal: showTimeoutModal, 
    timeLeft, 
    handleContinue: continueSession, 
    handleLogoutNow: timeoutLogout 
  } = useSessionTimeout(logout, isAuthenticated);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <AuthForm />
      )}
      
      {/* Session Timeout Modal - Now properly connected */}
      <SessionTimeoutModal
        open={showTimeoutModal}
        timeLeft={timeLeft}
        onContinue={continueSession}
        onLogout={timeoutLogout}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;