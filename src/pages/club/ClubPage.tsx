// src/pages/ClubPage.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert, Container, Button } from '@mui/material';
import { fetchClubs, createClub } from '../../services/clubService';
import { Club } from '../../types/club';
import { styled } from '@mui/material/styles';
import { ClubCard } from '../../component/ClubCard';
import AddIcon from '@mui/icons-material/Add';
import { CreateClubForm } from '../../component/CreateClubForm';
import { useSnackbar } from '../../hooks/useSnackbar';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const ClubPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const { triggerSnackbar } = useSnackbar();

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        const response = await fetchClubs();
        setClubs(response.results);
      } catch (error) {
        setError('Failed to load clubs');
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  const handleCreateClub = async (values: any) => {
    try {
      await createClub(values);
      setOpenCreateForm(false);
      triggerSnackbar('Club created successfully!', 'success');
      // Reload clubs
      const response = await fetchClubs();
      setClubs(response.results);
    } catch (error) {
      setError('Failed to create club');
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Clubs</Typography>
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
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {clubs.map((club) => (
            <Grid item key={club.id} xs={12} sm={6} md={4}>
              <ClubCard club={club} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateClubForm 
        open={openCreateForm}
        onClose={() => setOpenCreateForm(false)}
        onSubmit={handleCreateClub}
      />
    </StyledContainer>
  );
};