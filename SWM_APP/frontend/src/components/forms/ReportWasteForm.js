// src/components/forms/ReportWasteForm.js
import React, { useState, useEffect } from 'react'; // Add hooks import
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from '@mui/material';
import { FileUpload } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { wasteApi } from '../Axios'; // Add wasteApi import

const ReportWasteForm = () => {
  const { control, handleSubmit } = useForm();
  const [position, setPosition] = useState({ lat: null, lon: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('photo', data.photo);
      formData.append('gps_lat', position.lat);
      formData.append('gps_lon', position.lon);
      formData.append('description', data.description);
      formData.append('waste_type', data.type);

      await wasteApi.create(formData); // Remove unused response variable
      alert('Report submitted successfully!');
    } catch (error) {
      alert('Submission failed: ' + (error.response?.data || 'Unknown error'));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {/* Waste Description */}
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Waste Description"
            multiline
            rows={4}
            variant="outlined"
            {...field}
          />
        )}
      />

      {/* Waste Type Dropdown */}
      <FormControl>
        <InputLabel>Waste Type</InputLabel>
        <Controller
          name="type"
          control={control}
          defaultValue="general"
          render={({ field }) => (
            <Select {...field} label="Waste Type">
              <MenuItem value="general">General Waste</MenuItem>
              <MenuItem value="hazardous">Hazardous Waste</MenuItem>
              <MenuItem value="recyclable">Recyclable</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      {/* Photo Upload */}
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <Button
            component="label"
            variant="contained"
            startIcon={<FileUpload />}
          >
            Upload Photo
            <input
              type="file"
              hidden
              onChange={(e) => field.onChange(e.target.files[0])}
            />
          </Button>
        )}
      />

      {/* Submit Button */}
      <Button variant="contained" size="large" type="submit">
        Submit Report
      </Button>
    </Box>
  );
};

export default ReportWasteForm;
