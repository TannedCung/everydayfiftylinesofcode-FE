import React, { useEffect, useState } from 'react';
import { 
  Grid, Typography, Box, CircularProgress, Alert, Container, 
  Button, Pagination 
} from '@mui/material';
import { fetchClubs, createClub } from '../../services/clubService';
import { Club } from '../../types/club';
import { styled } from '@mui/material/styles';
import { ClubCard } from '../../component/ClubCard';
import AddIcon from '@mui/icons-material/Add';
import { CreateClubForm } from '../../component/CreateClubForm';
import { useSnackbar } from '../../hooks/useSnackbar';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Club[];
}

interface ClubState extends PaginatedResponse {
  page: number;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

export const ClubPage: React.FC = () => {
  const [myClubs, setMyClubs] = useState<ClubState>({
    results: [],
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  
  const [availableClubs, setAvailableClubs] = useState<ClubState>({
    results: [],
    count: 0,
    next: null,
    previous: null,
    page: 1
  });
  
  const [loading, setLoading] = useState({
    myClubs: false,
    availableClubs: false
  });
  const [error, setError] = useState<string | null>(null);
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const { triggerSnackbar } = useSnackbar();

  const loadClubs = async (isMyClubs: boolean, page: number = 1) => {
    const loadingKey = isMyClubs ? 'myClubs' : 'availableClubs';
    const setterFunction = isMyClubs ? setMyClubs : setAvailableClubs;

    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      const response = await fetchClubs(isMyClubs, page);
      setterFunction({
        ...response,
        page,
      });
    } catch (error) {
      setError(`Failed to load ${isMyClubs ? 'your' : 'available'} clubs`);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    loadClubs(true);
    loadClubs(false);
  }, []);

  const handleCreateClub = async (formData: FormData) => {
    try {
      await createClub(formData);
      setOpenCreateForm(false);
      triggerSnackbar('Club created successfully!', 'success');
      loadClubs(true);
      loadClubs(false);
    } catch (error) {
      triggerSnackbar('Failed to create club', 'error');
    }
  };

  const renderClubSection = (
    title: string,
    data: ClubState,
    isLoading: boolean,
    onPageChange: (page: number) => void
  ) => (
    <Box mb={6}>
      <Header sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h2">{title}</Typography>
        {title === 'Your Clubs' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateForm(true)}
            sx={{ 
              minWidth: '40px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              '& .MuiButton-startIcon': {
                margin: 0
              }
            }}
          />
        )}
      </Header>

      {isLoading && data.page === 1 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px', // Maximum width of container
            margin: '0 auto', // Center container
            px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        }}>
          <Grid container spacing={3}>
            {data.results.map((club) => (
              <Grid item key={club.id} xs={12} sm={6} md={4}>
                <ClubCard club={club} />
              </Grid>
            ))}
          </Grid>

          {data.count > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(data.count / 9)}
                page={data.page}
                onChange={(_e, page) => onPageChange(page)}
                disabled={isLoading}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <StyledContainer maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      {renderClubSection(
        'Your Clubs',
        myClubs,
        loading.myClubs,
        (page) => loadClubs(true, page)
      )}
      
      {renderClubSection(
        'Available Clubs',
        availableClubs,
        loading.availableClubs,
        (page) => loadClubs(false, page)
      )}

      <CreateClubForm 
        open={openCreateForm}
        onClose={() => setOpenCreateForm(false)}
        onSubmit={handleCreateClub}
      />
    </StyledContainer>
  );
};