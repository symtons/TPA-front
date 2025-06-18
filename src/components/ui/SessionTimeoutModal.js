// src/components/ui/SessionTimeoutModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  LinearProgress,
  Avatar,
  Stack
} from '@mui/material';
import { Warning, AccessTime } from '@mui/icons-material';

const SessionTimeoutModal = ({ 
  open, 
  timeLeft, 
  onContinue, 
  onLogout 
}) => {
  const progressValue = (timeLeft / 30) * 100;

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
          <Avatar 
            sx={{ 
              bgcolor: 'warning.main',
              width: 56,
              height: 56
            }}
          >
            <Warning sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Session Timeout Warning
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your session will expire soon
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You have been inactive for a while. Your session will automatically 
            expire in <strong>{timeLeft} seconds</strong> for security purposes.
          </Typography>
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
              <AccessTime color="warning" />
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {timeLeft}s
              </Typography>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: timeLeft > 10 
                    ? 'linear-gradient(90deg, #ff9800, #f57c00)'
                    : 'linear-gradient(90deg, #f44336, #d32f2f)'
                }
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Would you like to continue your session?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button
          onClick={onLogout}
          variant="outlined"
          color="error"
          size="large"
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Logout Now
        </Button>
        
        <Button
          onClick={onContinue}
          variant="contained"
          size="large"
          sx={{
            flex: 1,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1976d2 30%, #ff9800 90%)',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #f57c00 90%)',
            }
          }}
        >
          Continue Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutModal;