//src/components/forms/MySelectField.js

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Controller } from 'react-hook-form';

export default function MySelectField({ label, name, control, error, helperText, rules, options }) {
  return (
    <FormControl variant="outlined" fullWidth error={error}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${name}-label`}
            id={name}
            label={label}
          >
            <MenuItem value="">
              <em>Select a role</em>
            </MenuItem>
            {options.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {helperText && (
        <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginLeft: '14px' }}>
          {helperText}
        </span>
      )}
    </FormControl>
  );
}
