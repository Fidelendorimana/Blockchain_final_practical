import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, AppBar, Toolbar, Typography, Tab, Tabs } from '@mui/material';
import PatientRegistration from './components/PatientRegistration';
import AddMedicalRecord from './components/AddMedicalRecord';
import ViewRecords from './components/ViewRecords';
import DoctorManagement from './components/DoctorManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MedChain
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered>
            <Tab label="Patient Registration" />
            <Tab label="Add Medical Record" />
            <Tab label="View Records" />
            <Tab label="Doctor Management" />
          </Tabs>
          <Box sx={{ mt: 3 }}>
            {currentTab === 0 && <PatientRegistration />}
            {currentTab === 1 && <AddMedicalRecord />}
            {currentTab === 2 && <ViewRecords />}
            {currentTab === 3 && <DoctorManagement />}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;