import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal', backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority"
            sx={{ fontWeight: location.pathname === '/priority' ? 'bold' : 'normal', backgroundColor: location.pathname === '/priority' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
          >
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'white', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2026 Campus Notifications. 
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
