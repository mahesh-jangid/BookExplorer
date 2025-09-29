import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, useTheme, useMediaQuery, Slide } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScrollToTop from './ScrollToTop';
import { useScrollDirection } from '../hooks/animations';

const Layout = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollDirection = useScrollDirection();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Slide appear={false} direction="down" in={scrollDirection === 'up'}>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create(['background-color', 'box-shadow']),
            '&:hover': {
              backgroundColor: 'background.default',
              boxShadow: theme.shadows[1],
            },
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MenuBookIcon 
                sx={{ 
                  mr: 2,
                  color: 'primary.main',
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }} 
              />
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                component={RouterLink} 
                to="/" 
                sx={{
                  textDecoration: 'none',
                  color: 'text.primary',
                  fontWeight: 600,
                  letterSpacing: -0.5,
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Book Explorer
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  px: isMobile ? 1 : 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-2px)',
                  },
                  ...(location.pathname === '/' && {
                    color: 'primary.main',
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }),
                }}
              >
                Search
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/favorites"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  px: isMobile ? 1 : 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-2px)',
                  },
                  ...(location.pathname === '/favorites' && {
                    color: 'primary.main',
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }),
                }}
              >
                Favorites
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>
      
      <Container 
        component="main"
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          flexGrow: 1,
        }}
      >
        {children}
      </Container>

      <ScrollToTop />
    </Box>
  );
}

export default Layout;