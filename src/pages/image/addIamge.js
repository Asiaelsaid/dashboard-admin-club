import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import Dropzone from 'react-dropzone';
export default function AddIamge({ open, onClose, onAdd }) {
  const [newItem, setNewItem] = useState({
    id: 0,
    url: '',
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  // image functions
  const handleDrop = (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setUploadedImage(imageUrl);
      setNewItem({ ...newItem, url: imageUrl });
    }
  };
  const handleAdd = async () => {
    try {
      const response = await axiosInstance.post('/Image/Create',newItem );
      console.log(newItem);
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>اضافة صوره جديد</DialogTitle>
      <DialogContent>
        <Dropzone onDrop={handleDrop} accept="image/*">
          {({ getRootProps, getInputProps }) => (
            <Paper
              {...getRootProps()}
              elevation={3}
              style={{
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body1">اختيار صوره</Typography>
            </Paper>
          )}
        </Dropzone>

        {uploadedImage && (
          <div>
            <Typography variant="subtitle1" style={{ marginTop: 10 }}>
              : تم تحميل صوره
            </Typography>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', marginTop: 10 }} />
          </div>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleAdd} color="primary">
          اضافة
        </Button>
        <Button onClick={onClose} color="secondary">
          الغاء
        </Button>
      </DialogActions>
    </Dialog>
  )
}
