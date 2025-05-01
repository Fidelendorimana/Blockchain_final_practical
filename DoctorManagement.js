import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';

function DoctorManagement({ contract }) {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleAuthorize = async () => {
    try {
      const tx = await contract.authorizeDoctor(doctorAddress);
      await tx.wait();
      setMessage({ type: 'success', content: 'Doctor authorized successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleRevoke = async () => {
    try {
      const tx = await contract.revokeDoctor(doctorAddress);
      await tx.wait();
      setMessage({ type: 'success', content: 'Doctor authorization revoked!' });
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Doctor Authorization Management
      </Typography>
      
      <TextField
        fullWidth
        label="Doctor Address"
        value={doctorAddress}
        onChange={(e) => setDoctorAddress(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAuthorize}
        >
          Authorize Doctor
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleRevoke}
        >
          Revoke Authorization
        </Button>
      </Box>

      {message.content && (
        <Alert severity={message.type}>
          {message.content}
        </Alert>
      )}
    </Paper>
  );
}

export default DoctorManagement;


