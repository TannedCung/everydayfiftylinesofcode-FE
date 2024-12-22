import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Map routes to display names
const routeNames: { [key: string]: string } = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'challenges': 'Challenges',
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  
  // Generate breadcrumb items from current path
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const breadcrumbItems = pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const displayName = routeNames[value] || value;

    return last ? (
      <Typography 
        key={to}
        variant="body1" 
        sx={{ color: 'text.primary', fontWeight: 600 }}
      >
        {displayName}
      </Typography>
    ) : (
      <Link
        key={to}
        to={to}
        style={{ 
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <Typography variant="body1">
          {displayName}
        </Typography>
      </Link>
    );
  });

  // Always include home as first item if not already at home
  const homeItem = location.pathname !== '/' ? (
    <Link
      to="/"
      style={{ 
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <Typography variant="body1">
        Home
      </Typography>
    </Link>
  ) : null;

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {homeItem}
      {breadcrumbItems}
    </StyledBreadcrumbs>
  );
}