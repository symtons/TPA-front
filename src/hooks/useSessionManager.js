// src/hooks/useSessionManager.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const SESSION_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds
const WARNING_TIME = 30 * 1000; // Show warning 30 seconds before timeout

export const useSessionManager = () => {
  const { logout, isAuthenticated } = useAuth();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Activities that reset the session timer
  const resetSessionTimer = useCallback(() => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    // Hide modal if showing
    setShowTimeoutModal(false);

    // Set warning timer (show modal 30 seconds before logout)
    warningTimeoutRef.current = setTimeout(() => {
      setShowTimeoutModal(true);
      setTimeLeft(30);
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set actual logout timer
    timeoutRef.current = setTimeout(() => {
      handleSessionTimeout();
    }, SESSION_TIMEOUT);

  }, [isAuthenticated]);

  const handleSessionTimeout = useCallback(() => {
    // Clear all timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setShowTimeoutModal(false);
    logout();
  }, [logout]);

  const handleContinueSession = useCallback(() => {
    // Clear the countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    // Reset the session timer
    resetSessionTimer();
  }, [resetSessionTimer]);

  const handleLogoutNow = useCallback(() => {
    handleSessionTimeout();
  }, [handleSessionTimeout]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      resetSessionTimer();
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetSessionTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, resetSessionTimer]);

  // Handle tab visibility change
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible, check if session should still be active
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT) {
          // Session expired while tab was hidden
          handleSessionTimeout();
        } else if (timeSinceLastActivity >= (SESSION_TIMEOUT - WARNING_TIME)) {
          // Should show warning
          const remainingTime = Math.ceil((SESSION_TIMEOUT - timeSinceLastActivity) / 1000);
          if (remainingTime > 0) {
            setShowTimeoutModal(true);
            setTimeLeft(remainingTime);
            
            countdownRef.current = setInterval(() => {
              setTimeLeft(prev => {
                if (prev <= 1) {
                  handleSessionTimeout();
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            handleSessionTimeout();
          }
        } else {
          // Reset timer for remaining time
          resetSessionTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, resetSessionTimer, handleSessionTimeout]);

  return {
    showTimeoutModal,
    timeLeft,
    handleContinueSession,
    handleLogoutNow,
    resetSessionTimer
  };
};