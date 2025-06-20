// src/hooks/useSessionTimeout.js
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

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setShowModal(false);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowModal(true);
      setTimeLeft(30);
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      onLogout();
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, onLogout]);

  const handleContinue = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    resetTimer();
  }, [resetTimer]);

  const handleLogoutNow = useCallback(() => {
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  return {
    showModal,
    timeLeft,
    handleContinue,
    handleLogoutNow
  };
};

export default useSessionTimeout;