// src/theme.js
import { createTheme } from '@mui/material/styles';

// Correct palette structure and add custom colors
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },  // Green
    secondary: { main: '#d32f2f' }, // Red
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", sans-serif',
    button: { textTransform: 'none' }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disables button text transformation
          margin: '4px', // Adds margin to the button
          borderRadius: 8, // Sets rounded corners for the button
        },
      },
    },
  },
});

export default theme;
