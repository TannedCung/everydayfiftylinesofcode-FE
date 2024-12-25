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
            <Box display="flex" justifyContent="center" gap={2}>
              <Box textAlign="center">
                <input
                  accept="image/*"
                  type="file"
                  id="avatar-upload"
                  hidden
                  onChange={(e) => handleImageChange(e, 'avatar')}
                />
                <label htmlFor="avatar-upload">
                  <IconButton component="span">
                    {avatarPreview ? (
                      <Avatar
                        src={avatarPreview}
                        sx={{ width: 80, height: 80 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 80, height: 80 }}>
                        <AddPhotoAlternateIcon />
                      </Avatar>
                    )}
                  </IconButton>
                </label>
                <Typography variant="caption">Club Avatar</Typography>
              </Box>

              <Box textAlign="center">
                <input
                  accept="image/*"
                  type="file"
                  id="background-upload"
                  hidden
                  onChange={(e) => handleImageChange(e, 'background_image')}
                />
                <label htmlFor="background-upload">
                  <IconButton component="span">
                    <Box
                      sx={{
                        width: 160,
                        height: 80,
                        border: '1px dashed grey',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: backgroundPreview ? `url(${backgroundPreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!backgroundPreview && <AddPhotoAlternateIcon />}
                    </Box>
                  </IconButton>
                </label>
                <Typography variant="caption">Background Image</Typography>
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