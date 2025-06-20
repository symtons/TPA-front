// =============================================================================
// DASHBOARD DEBUG TEST COMPONENT
// File: src/components/DashboardDebugTest.js (NEW FILE)
// Add this component to test your dashboard API
// =============================================================================

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import dashboardApi from '../services/dashboardApi';

const DashboardDebugTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');

  const testRole = 'Admin'; // Change this to test different roles
  const testUserId = 11; // Use the test user ID from your database

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`🧪 Running test: ${testName}`);
      const result = await testFunction();
      setResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
      console.log(`✅ Test ${testName} passed:`, result);
    } catch (err) {
      console.error(`❌ Test ${testName} failed:`, err);
      setResults(prev => ({
        ...prev,
        [testName]: { success: false, error: err.message }
      }));
      setError(`Test ${testName} failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'API Health Check',
      description: 'Test basic API connectivity',
      action: () => runTest('health', () => dashboardApi.testConnection())
    },
    {
      name: 'Dashboard Controller Test',
      description: 'Test dashboard controller endpoint',
      action: () => runTest('controller', () => dashboardApi.testDashboard())
    },
    {
      name: 'Dashboard Stats',
      description: `Get dashboard stats for ${testRole}`,
      action: () => runTest('stats', () => dashboardApi.getDashboardStats(testRole))
    },
    {
      name: 'Quick Actions',
      description: `Get quick actions for ${testRole}`,
      action: () => runTest('actions', () => dashboardApi.getQuickActions(testRole))
    },
    {
      name: 'Recent Activities',
      description: `Get recent activities for user ${testUserId}`,
      action: () => runTest('activities', () => dashboardApi.getRecentActivities(testUserId, testRole))
    },
    {
      name: 'Dashboard Summary',
      description: `Get full dashboard summary`,
      action: () => runTest('summary', () => dashboardApi.getDashboardSummary(testUserId, testRole))
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await test.action();
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard API Debug Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Testing dashboard API endpoints with Role: <strong>{testRole}</strong>, User ID: <strong>{testUserId}</strong>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button 
            variant="contained" 
            onClick={runAllTests}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Run All Tests
          </Button>
        </Grid>
        
        {tests.map((test, index) => (
          <Grid item key={index}>
            <Button 
              variant="outlined" 
              onClick={test.action}
              disabled={loading}
              size="small"
            >
              {test.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {Object.keys(results).length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Test Results:
          </Typography>
          
          {Object.entries(results).map(([testName, result]) => (
            <Accordion key={testName} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    {testName}
                  </Typography>
                  <Alert 
                    severity={result.success ? 'success' : 'error'} 
                    sx={{ py: 0, px: 1 }}
                  >
                    {result.success ? 'PASS' : 'FAIL'}
                  </Alert>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  {result.success ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Success! Data received:
                      </Typography>
                      <pre style={{ 
                        background: '#fff', 
                        padding: '12px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto',
                        maxHeight: '300px'
                      }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="error" gutterBottom>
                        Error:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'error.dark' }}>
                        {result.error}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <Paper sx={{ p: 3, mt: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Instructions:
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Make sure your backend API is running on https://localhost:7062</li>
            <li>Execute the SQL script to add QuickActions and ActivityTypes data</li>
            <li>Replace your DashboardController.cs with the fixed version (no auth)</li>
            <li>Replace your dashboardApi.js with the simplified version</li>
            <li>Run these tests to verify each endpoint works</li>
            <li>Once all tests pass, your dashboard should load correctly</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardDebugTest;