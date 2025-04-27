// src/components/NotificationProvider.js
import { Snackbar, Alert } from '@mui/material';
import { createContext, useState } from 'react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {children}
      <Snackbar open={!!notification} onClose={() => setNotification(null)}>
        <Alert severity={notification?.type}>{notification?.message}</Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
