// src/components/ui/CustomInput.js
import React from 'react';
import { TextField, FormControl, InputLabel, Select } from '@mui/material';

const CustomInput = ({ 
  type = 'text',
  variant = 'outlined',
  fullWidth = true,
  margin = 'normal',
  ...props 
}) => {
  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#ff9800',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1976d2',
    },
  };

  if (type === 'select') {
    return (
      <FormControl 
        fullWidth={fullWidth} 
        margin={margin}
        sx={baseStyles}
      >
        <InputLabel>{props.label}</InputLabel>
        <Select
          sx={{
            borderRadius: 2,
          }}
          {...props}
        >
          {props.children}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      margin={margin}
      sx={baseStyles}
      {...props}
    />
  );
};

export default CustomInput;