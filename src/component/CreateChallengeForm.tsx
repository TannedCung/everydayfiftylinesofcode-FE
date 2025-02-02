// src/components/CreateChallengeForm.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  IconButton,
  Avatar,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSnackbar } from '../hooks/useSnackbar';

interface CreateChallengeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormData) => void;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  commitment_by: yup.string().required('Commitment type is required'),
  description: yup.string().required('Description is required'),
  target_value: yup.number().required('Target value is required').min(1),
  frequency: yup.number().required('Frequency is required').min(1),
  start_date: yup.date().required('Start date is required'),
  end_date: yup.date().nullable(),
  background_image: yup.mixed(),
  logo: yup.mixed()
});

export const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { triggerSnackbar } = useSnackbar();

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      
      // Add required fields
      formData.append('name', values.name);
      formData.append('type', values.type);
      formData.append('commitment_by', values.commitment_by);
      formData.append('description', values.description);
      formData.append('target_value', String(values.target_value));
      formData.append('frequency', String(values.frequency));
      
      // Format date
      const startDate = values.start_date instanceof Date ? 
        values.start_date.toISOString().split('T')[0] : values.start_date;
      formData.append('start_date', startDate);
  
      if (values.end_date) {
        const endDate = values.end_date instanceof Date ?
          values.end_date.toISOString().split('T')[0] : values.end_date;
        formData.append('end_date', endDate);
      }
  
      // Add files
      if (values.background_image instanceof File) {
        formData.append('background_image', values.background_image);
      }
      if (values.logo instanceof File) {
        formData.append('logo', values.logo);
      }
  
      await onSubmit(formData);
      triggerSnackbar('Challenge created successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      triggerSnackbar('Failed to create challenge. Please try again.', 'error');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'commits',
      commitment_by: 'daily',
      description: '',
      target_value: 1,
      frequency: 1,
      start_date: new Date(),
      end_date: null,
      background_image: null,
      logo: null
    },
    validationSchema,
    onSubmit: handleSubmit,
    validate: (values) => {
      try {
        validationSchema.validateSync(values, { abortEarly: false });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          triggerSnackbar('Please check the form for errors', 'warning');
        }
      }
    }
  });

  const handleImageChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        triggerSnackbar('Image file is too large. Please select a smaller file.', 'error');
        return;
      }
      formik.setFieldValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'background_image') {
          setBackgroundPreview(reader.result as string);
        } else {
          setLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Challenge</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
          {/* Background Image at top */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Background Image
              </Typography>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 200, 
                  border: '1px dashed grey',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 3
                }}
              >
                {backgroundPreview ? (
                  <>
                    <Box
                      component="img"
                      src={backgroundPreview}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      sx={{ position: 'absolute', right: 8, top: 8, backgroundColor: 'rgba(255,255,255,0.8)' }}
                      component="label"
                    >
                      <AddPhotoAlternateIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange('background_image')}
                      />
                    </IconButton>
                  </>
                ) : (
                  <IconButton component="label">
                    <AddPhotoAlternateIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange('background_image')}
                    />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom align="center">
              Logo
            </Typography>
              <Box sx={{ position: 'relative' }}>
                {logoPreview ? (
                  <Avatar
                    src={logoPreview}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: '2px dashed grey',
                      cursor: 'pointer'
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange('logo')}
                    />
                  </Avatar>
                ) : (
                  <Avatar
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: '2px dashed grey',
                      cursor: 'pointer'
                    }}
                    component="label"
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange('logo')}
                    />
                  </Avatar>
                )}
              </Box>
            </Box>
            <TextField
              fullWidth
              name="name"
              label="Challenge Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <MenuItem value="commits">Commits</MenuItem>
                <MenuItem value="lines_of_code">Lines of Code</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Commitment Type</InputLabel>
              <Select
                name="commitment_by"
                value={formik.values.commitment_by}
                onChange={formik.handleChange}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="accumulate">Accumulate</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto', // Allow height to grow
                  overflow: 'auto' // Add scrollbar when needed
                },
                '& .MuiOutlinedInput-root': {
                  height: 'auto' // Allow outline to grow with content
                }
              }}
            />

            <TextField
              fullWidth
              type="number"
              name="target_value"
              label="Target Value"
              value={formik.values.target_value}
              onChange={formik.handleChange}
              error={formik.touched.target_value && Boolean(formik.errors.target_value)}
              helperText={formik.touched.target_value && formik.errors.target_value}
            />

            <TextField
              fullWidth
              type="number" 
              name="frequency"
              label="Frequency"
              value={formik.values.frequency}
              onChange={formik.handleChange}
              error={formik.touched.frequency && Boolean(formik.errors.frequency)}
              helperText={formik.touched.frequency && formik.errors.frequency}
            />

            <DatePicker
              label="Start Date"
              value={formik.values.start_date}
              onChange={(value) => formik.setFieldValue('start_date', value)}
            />

            <DatePicker
              label="End Date (Optional)"
              value={formik.values.end_date}
              onChange={(value) => formik.setFieldValue('end_date', value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Challenge
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};