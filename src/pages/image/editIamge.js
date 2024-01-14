import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosConfig/instance';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from '@mui/material';
import Dropzone from 'react-dropzone';
export default function EditIamge({ open, itemId, onClose }) {
  const [editedUrl, setEditedUrl] = useState({
    id: 0,
    url: '',
  })
  const [uploadedImage, setUploadedImage] = useState(null);
  //get item details
  const fetchItemDetails = async () => {
    try {
      const response = await axiosInstance.get(`/Image/Get?id=${itemId}`);
      // console.log(response.data.data);
      setEditedUrl(response.data.data.url);
    } catch (error) {
      console.log(error);
    }
  };
  // image functions
  const handleDrop = (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setUploadedImage(imageUrl);
      setEditedUrl({ ...editedUrl, url: imageUrl });
    }
  };
  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);
  //put data
  const handleEdit = async () => {
    try {
      await axiosInstance.put(`/Image/Update?id=${itemId}`, { url: editedUrl.url });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>تعديل الصورة</DialogTitle>
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
              <Typography variant="body1">تعديل صوره</Typography>
              {/* <img src={editedUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: 10 }} /> */}
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
        <Button onClick={handleEdit} color="primary">
          حفظ
        </Button>
        <Button onClick={onClose} color="secondary">
          الغاء
        </Button>
      </DialogActions>
    </Dialog>
  )
}
