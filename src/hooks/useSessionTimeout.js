// =============================================================================
// FIXED SESSION TIMEOUT HOOK
// File: src/hooks/useSessionTimeout.js (Replace existing)
// =============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes
const WARNING_TIME = 30 * 1000; // 30 seconds warning

const useSessionTimeout = (onLogout, isAuthenticated) => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const countdownRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    console.log('🔄 Resetting session timeout timer');

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    setShowModal(false);

    // Set warning timer (show modal 30 seconds before timeout)
    warningRef.current = setTimeout(() => {
      console.log('⚠️ Showing session timeout warning');
      setShowModal(true);
      setTimeLeft(30);
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            console.log('⏰ Session timeout - logging out');
            clearInterval(countdownRef.current);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set final logout timer (backup)
    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Final session timeout - logging out');
      onLogout();
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, onLogout]);

  const handleContinue = useCallback(() => {
    console.log('✅ User chose to continue session');
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setShowModal(false);
    resetTimer();
  }, [resetTimer]);

  const handleLogoutNow = useCallback(() => {
    console.log('🚪 User chose to logout immediately');
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setShowModal(false);
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('❌ User not authenticated - clearing session timers');
      // Clear all timers when not authenticated
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      setShowModal(false);
      return;
    }

    console.log('👤 User authenticated - starting session timeout monitoring');

    // Events that indicate user activity
    const events = [
      'mousedown', 
      'mousemove', 
      'keypress', 
      'scroll', 
      'touchstart',
      'click',
      'keydown'
    ];
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Start the timer
    resetTimer();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up session timeout listeners');
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  // Debug logging
  useEffect(() => {
    if (showModal) {
      console.log(`⏳ Session timeout warning shown - ${timeLeft} seconds remaining`);
    }
  }, [showModal, timeLeft]);

  return {
    showModal,
    timeLeft,
    handleContinue,
    handleLogoutNow
  };
};

export default useSessionTimeout;