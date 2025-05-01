import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Box
} from '@mui/material';

function ViewRecords({ contract }) {
  const [records, setRecords] = useState([]);
  const [patientAddress, setPatientAddress] = useState('');

  const fetchRecords = async () => {
    try {
      const records = await contract.getPatientRecords(patientAddress);
      setRecords(records);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Patient Address"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={fetchRecords}
          fullWidth
        >
          Fetch Records
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Prescription</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(record.timestamp * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.doctorName}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.prescription}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ViewRecords;