// src/layouts/MainLayout.tsx
import { Box, CssBaseline, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import SideMenu from '../component/SideMenu';
import AppNavbar from '../component/AppNavbar';
import { Outlet } from 'react-router-dom';
import Header from '../component/Header';

export default function MainLayout() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
        <Header />
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}