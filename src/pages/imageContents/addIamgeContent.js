import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import Dropzone from 'react-dropzone';

export default function AddIamgeContent({ open, onClose, onAdd }) {
  const [newsTypes, setNewsTypes] = useState([]);
  const [images, setImages] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    newsTypeId: 0,
    date: '',
    imageId: 0,
    imageUrl: '',
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  // image functions
  const handleDrop = (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setUploadedImage(imageUrl);
      setNewItem({ ...newItem, imageUrl: imageUrl });
    }
  };

  //get data from api
  const fetchData = async () => {
    try {
      // Fetch news types from API
      const newsTypesResponse = await axiosInstance.get('/NewsType/GetAll');
      setNewsTypes(newsTypesResponse.data.data);

      // Fetch images from API
      const imagesResponse = await axiosInstance.get('/Image/GetAll');
      //   console.log(imagesResponse.data.data);
      setImages(imagesResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
    const date = new Date()
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    setNewItem({ ...newItem, date: currentDate })
  }, []);
  //add new content
  const handleAdd = async () => {
    try {

      const response = await axiosInstance.post('/ImageContents/Create', newItem);
      onAdd(response.data);
      onClose();
    } catch (error) {
      console.error(error);

    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth='500px !important'>
      <DialogTitle>اضافة محتوي صوره جديد</DialogTitle>
      <DialogContent>
        <TextField
          label="العنوان"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          label="الوصف"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          fullWidth
          margin="normal"
          multiline
        />
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
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="news-type">نوع الخبر</InputLabel>
          <Select
            id="news-type"
            value={newItem.newsTypeId}
            onChange={(e) => setNewItem({ ...newItem, newsTypeId: e.target.value })}
          >
            {newsTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="image">الصورة</InputLabel>
          <Select
            id="image"
            value={newItem.imageId}
            onChange={(e) => setNewItem({ ...newItem, imageId: e.target.value })}
          >
            {images.map((image) => (
              <MenuItem key={image.id} value={image.id}>
                <img src={image.url} alt='img rom api' width={50} />

              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
