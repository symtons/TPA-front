// =============================================================================
// TIME ENTRIES COMPONENT - TIME ENTRY HISTORY
// File: src/components/timeAttendance/TimeEntries.js
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  IconButton,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Alert
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  DateRange,
  FilterList,
  Refresh,
  Download,
  Search,
  Clear,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import timeAttendanceApi from '../../services/timeAttendanceApi';

const TimeEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Summary states
  const [summary, setSummary] = useState({
    totalHours: 0,
    totalEntries: 0,
    avgHoursPerDay: 0,
    locations: []
  });

  useEffect(() => {
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchTimeEntries();
    }
  }, [startDate, endDate, page]);

  const fetchTimeEntries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await timeAttendanceApi.getTimeEntries(
        user.employee?.id || user.id,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      );
      
      if (response.success) {
        let filteredEntries = response.data;
        
        // Apply client-side filters
        if (statusFilter !== 'all') {
          filteredEntries = filteredEntries.filter(entry => 
            entry.status.toLowerCase() === statusFilter.toLowerCase()
          );
        }
        
        if (locationFilter !== 'all') {
          filteredEntries = filteredEntries.filter(entry => 
            entry.location && entry.location.toLowerCase().includes(locationFilter.toLowerCase())
          );
        }
        
        setEntries(filteredEntries);
        calculateSummary(filteredEntries);
        
        // Calculate pagination (client-side for simplicity)
        const entriesPerPage = 10;
        setTotalPages(Math.ceil(filteredEntries.length / entriesPerPage));
      }
    } catch (err) {
      setError('Failed to load time entries');
      console.error('Error fetching time entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (entries) => {
    const totalHours = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    const uniqueLocations = [...new Set(entries.map(entry => entry.location).filter(Boolean))];
    const workingDays = new Set(entries.map(entry => 
      new Date(entry.clockIn).toDateString()
    )).size;
    
    setSummary({
      totalHours,
      totalEntries: entries.length,
      avgHoursPerDay: workingDays > 0 ? totalHours / workingDays : 0,
      locations: uniqueLocations
    });
  };

  const handleFilter = () => {
    fetchTimeEntries();
  };

  const handleClearFilters = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
    setStatusFilter('all');
    setLocationFilter('all');
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const formatDuration = (hours) => {
    if (!hours) return '-';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRowColor = (entry) => {
    if (entry.status === 'Active') return 'primary.50';
    if (entry.totalHours && entry.totalHours > 8) return 'warning.50';
    return 'transparent';
  };

  // Paginate entries
  const entriesPerPage = 10;
  const startIndex = (page - 1) * entriesPerPage;
  const paginatedEntries = entries.slice(startIndex, startIndex + entriesPerPage);

  if (loading && entries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {formatDuration(summary.totalHours)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {summary.totalEntries}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time Entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {formatDuration(summary.avgHoursPerDay)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Hours/Day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {summary.locations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Locations Used
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filter Time Entries
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  {summary.locations.map((location, index) => (
                    <MenuItem key={index} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleFilter}
                disabled={loading}
                fullWidth
                size="small"
              >
                Filter
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Clear
                </Button>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={fetchTimeEntries}
                    disabled={loading}
                    size="small"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Time Entries Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Time Entry Records
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                size="small"
                disabled={!entries.length}
              >
                Export CSV
              </Button>
              {loading && <CircularProgress size={20} />}
            </Box>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Clock In</TableCell>
                  <TableCell>Clock Out</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEntries.map((entry) => {
                  const clockInFormatted = formatDateTime(entry.clockIn);
                  const clockOutFormatted = entry.clockOut ? formatDateTime(entry.clockOut) : null;
                  
                  return (
                    <TableRow 
                      key={entry.id}
                      sx={{ 
                        bgcolor: getRowColor(entry),
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DateRange sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {clockInFormatted.date}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(entry.clockIn).toLocaleDateString('en-US', { weekday: 'short' })}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <AccessTime sx={{ mr: 1, color: 'success.main', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="medium">
                            {clockInFormatted.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {clockOutFormatted ? (
                          <Box display="flex" alignItems="center">
                            <AccessTime sx={{ mr: 1, color: 'error.main', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight="medium">
                              {clockOutFormatted.time}
                            </Typography>
                          </Box>
                        ) : (
                          <Chip 
                            label="In Progress" 
                            color="primary" 
                            size="small"
                            icon={<TrendingUp />}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          color={entry.totalHours && entry.totalHours > 8 ? 'warning.main' : 'text.primary'}
                        >
                          {formatDuration(entry.totalHours)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                          <Typography variant="body2">
                            {entry.location || 'Not specified'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={entry.status} 
                          color={getStatusColor(entry.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {entries.length === 0 && !loading && (
            <Box textAlign="center" py={6}>
              <AccessTime sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No time entries found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adjust your filter criteria or check back after clocking some time
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TimeEntries;