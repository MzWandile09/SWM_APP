//src/components/forms/MyTextFields.js
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function MyTextField(props) {
    const { label, placeholder, name, control } = props;
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ 
                field: { onChange, onBlur, value, ref }, // Fixed destructuring
                fieldState: { error },
            }) => (
                <TextField 
                    id="standard-basic" 
                    label={label}
                    variant="standard" 
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}  // Now properly defined
                    value={value}
                    inputRef={ref}    // Now properly defined
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                />
            )}
        />
    );
}
