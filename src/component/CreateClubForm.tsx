import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Stack, Box, Avatar, IconButton, 
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface CreateClubFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

interface FormValues {
  name: string;
  description: string;
  background_image?: File;
  avatar?: File;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required').max(100, 'Name must be less than 100 characters'),
  description: yup.string(),
  background_image: yup.mixed(),
  avatar: yup.mixed()
});

export const CreateClubForm: React.FC<CreateClubFormProps> = ({ open, onClose, onSubmit }) => {
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key as keyof FormValues]) {
          formData.append(key, values[key as keyof FormValues] as Blob | string);
        }
      });
      onSubmit(formData);
      formik.resetForm();
      setAvatarPreview('');
      setBackgroundPreview('');
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'background_image') => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'avatar') {
          setAvatarPreview(reader.result as string);
        } else {
          setBackgroundPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Club</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
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
                        onChange={(e) => handleImageChange(e, 'background_image')}
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
                      onChange={(e) => handleImageChange(e, 'background_image')}
                    />
                  </IconButton>
                )}
              </Box>
            </Box>
        
            {/* Avatar below */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom align="center">
                Club Avatar
              </Typography>
              <Box sx={{ position: 'relative' }}>
                {avatarPreview ? (
                  <Avatar
                    src={avatarPreview}
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
                      onChange={(e) => handleImageChange(e, 'avatar')}
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
                      onChange={(e) => handleImageChange(e, 'avatar')}
                    />
                  </Avatar>
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              name="name"
              label="Club Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Club
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};