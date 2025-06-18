// src/hooks/useSessionTimeout.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds
const WARNING_TIMEOUT = 30 * 1000; // 30 seconds warning before logout

// Events that reset the inactivity timer
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click'
];

const useSessionTimeout = () => {
  const { logout, refreshSession, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const handleLogout = useCallback(async () => {
    // Clear all timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setShowWarning(false);
    await logout();
  }, [logout]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Hide warning if showing
    if (showWarning) {
      setShowWarning(false);
    }

    if (!isAuthenticated) return;

    // Set warning timer (show warning 30 seconds before logout)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(30);
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_TIMEOUT);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [showWarning, isAuthenticated, handleLogout]);

  const continueSession = useCallback(async () => {
    try {
      const success = await refreshSession();
      if (success) {
        setShowWarning(false);
        resetTimer();
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      handleLogout();
    }
  }, [refreshSession, resetTimer, handleLogout]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timers when not authenticated
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      setShowWarning(false);
      return;
    }

    // Add event listeners for user activity
    const handleActivity = () => {
      resetTimer();
    };

    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer start
    resetTimer();

    // Cleanup function
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  // Handle page visibility change (user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, don't reset timer
        return;
      } else {
        // Page is visible again, check if too much time has passed
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          handleLogout();
        } else {
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleLogout, resetTimer]);

  return {
    showWarning,
    timeLeft,
    continueSession,
    handleLogout
  };
};

export default useSessionTimeout;