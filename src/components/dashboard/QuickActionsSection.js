// src/components/dashboard/QuickActionsSection.js
import React from 'react';
import CustomCard from '../ui/CustomCard';
import QuickActions from './QuickActions';

const QuickActionsSection = ({ user, onActionClick }) => {
  return (
    <CustomCard 
      title="Quick Actions" 
      sx={{ 
        height: 'fit-content',
        '& .MuiCardContent-root': {
          pb: 2 // Reduce bottom padding
        }
      }}
    >
      <QuickActions user={user} onActionClick={onActionClick} />
    </CustomCard>
  );
};

export default QuickActionsSection;