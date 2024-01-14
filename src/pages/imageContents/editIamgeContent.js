import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosConfig/instance';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import Dropzone from 'react-dropzone';

export default function EditIamgeContent({open, itemId, onClose }) {
    //variables
    const [newsTypes, setNewsTypes] = useState([]);
    const [images, setImages] = useState([]);
    const [editItem, setEditItem] = useState({
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
          setEditItem({ ...editItem, imageUrl: imageUrl });
        }
      };
    //get item details
    const fetchItemDetails = async () => {
      try {
        const response = await axiosInstance.get(`/ImageContents/Get?id=${itemId}`);
        setEditItem(response.data.data)
        // console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    //get data
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
        setEditItem({ ...editItem, date: currentDate })
      }, []);
     

    useEffect(() => {
      fetchItemDetails();
    }, [itemId]);
    const handleEdit = async () => {
      try {
        await axiosInstance.put(`/ImageContents/Update?id=${itemId}`,editItem);
        onClose();
      } catch (error) {
        console.log(error);
      }
    };
return (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>تعديل محتوي الصورة </DialogTitle>
    <DialogContent>
    <TextField
          label="العنوان"
          value={editItem.title}
          onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          label="الوصف"
          value={editItem.description}
          onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
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
            value={editItem.newsTypeId}
            onChange={(e) => setEditItem({ ...editItem, newsTypeId: e.target.value })}
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
            value={editItem.imageId}
            onChange={(e) => setEditItem({ ...editItem, imageId: e.target.value })}
          >
            {images.map((image) => (
              <MenuItem key={image.id} value={image.id}>
                <img src={image.url} alt='img rom api' width={50}/>
               
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
