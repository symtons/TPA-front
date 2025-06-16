// src/components/dashboard/DashboardStats.js
import React from 'react';
import { Grid } from '@mui/material';
import StatCard from '../ui/StatCard';
import { 
  People, 
  Schedule, 
  Assignment, 
  TrendingUp,
  AccessTime,
  CheckCircle,
  Warning,
  Analytics
} from '@mui/icons-material';
import { ROLES } from '../../constants';

const DashboardStats = ({ user }) => {
  const getStatsForRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { 
            title: 'Total Employees', 
            value: '142', 
            color: 'primary',
            icon: <People />,
            subtitle: 'Active staff members'
          },
          { 
            title: 'Pending Requests', 
            value: '24', 
            color: 'warning',
            icon: <Warning />,
            subtitle: 'Awaiting approval'
          },
          { 
            title: 'Active Shifts', 
            value: '8', 
            color: 'info',
            icon: <Schedule />,
            subtitle: 'Currently running'
          },
          { 
            title: 'System Status', 
            value: 'Online', 
            color: 'success',
            icon: <Analytics />,
            subtitle: 'All systems operational'
          }
        ];
      case ROLES.HR_MANAGER:
        return [
          { 
            title: 'Total Employees', 
            value: '156', 
            color: 'primary',
            icon: <People />,
            trend: '+12 this month',
            subtitle: 'All departments'
          },
          { 
            title: 'Pending Leave', 
            value: '8', 
            color: 'warning',
            icon: <Schedule />,
            trend: '2 urgent',
            subtitle: 'Requests awaiting review'
          },
          { 
            title: 'New Hires', 
            value: '5', 
            color: 'success',
            icon: <TrendingUp />,
            trend: 'This quarter',
            subtitle: 'Onboarding in progress'
          },
          { 
            title: 'Onboarding Tasks', 
            value: '12', 
            color: 'info',
            icon: <Assignment />,
            trend: '85% completed',
            subtitle: 'Active checklist items'
          }
        ];
      case ROLES.ADMIN_STAFF:
        return [
          { 
            title: 'PTO Balance', 
            value: '15 days', 
            color: 'success',
            icon: <Schedule />,
            trend: 'Well balanced',
            subtitle: 'Available this year'
          },
          { 
            title: 'Hours This Week', 
            value: '32', 
            color: 'info',
            icon: <AccessTime />,
            trend: '+4 from last week',
            subtitle: 'Out of 40 hours'
          },
          { 
            title: 'Pending Tasks', 
            value: '3', 
            color: 'warning',
            icon: <Assignment />,
            trend: '1 due today',
            subtitle: 'Action items'
          },
          { 
            title: 'Completed Projects', 
            value: '23', 
            color: 'primary',
            icon: <CheckCircle />,
            trend: '+2 this month',
            subtitle: 'Successfully finished'
          }
        ];
      case ROLES.FIELD_STAFF:
        return [
          { 
            title: 'Hours Today', 
            value: '6.5', 
            color: 'info',
            icon: <AccessTime />,
            trend: 'On track',
            subtitle: 'Current shift progress'
          },
          { 
            title: 'Active Tasks', 
            value: '4', 
            color: 'warning',
            icon: <Assignment />,
            trend: '2 high priority',
            subtitle: 'Assigned to you'
          },
          { 
            title: 'Completed Jobs', 
            value: '23', 
            color: 'success',
            icon: <CheckCircle />,
            trend: '+3 this week',
            subtitle: 'This month'
          },
          { 
            title: 'Next Shift', 
            value: 'Tomorrow', 
            color: 'primary',
            icon: <Schedule />,
            trend: '8:00 AM',
            subtitle: 'Field assignment'
          }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole(user.role);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;