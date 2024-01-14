import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosConfig/instance';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import YouTube from 'react-youtube';



export default function EditVideoContent({open, itemId, onClose }) {
  //variables
  const [newsTypes, setNewsTypes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [editItem, setEditItem] = useState({
      id:0,
      url: '',
      title:'',
      description:'',
      newsTypeId:0,
      videoId:0,
      videoUrl:'',
    });
         //video options 
  const opts = {
    height: '100',
    width: '150',
    playerVars: {
      autoplay: 1,
    },
  };
  //get item details
  const fetchItemDetails = async () => {
    try {
      const response = await axiosInstance.get(`/VideoContents/Get?id=${itemId}`);
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

      // Fetch Videos from API
      const videossResponse = await axiosInstance.get('/Video/GetAll');
    setVideos(videossResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
 

useEffect(() => {
  fetchItemDetails();
}, [itemId]);
const handleEdit = async () => {
  try {
    await axiosInstance.put(`/VideoContents/Update?id=${itemId}`,editItem);
    onClose();
  } catch (error) {
    console.log(error);
  }
};
    //video functions 
    const getVideoIdFromUrl = (url) => {
      const fullUrlMatch = url.match(/[?&]v=([^?&]+)/);
      if (fullUrlMatch) {
        return fullUrlMatch[1];
      }
      // Check if the URL is in the short format (/watch?v=VIDEO_ID)
      const shortUrlMatch = url.match(/\/watch\?v=([^?&]+)/);
      if (shortUrlMatch) {
        return shortUrlMatch[1];
      }
      const shortFormatMatch = url.match(/youtu\.be\/([^?&]+)/);
      if (shortFormatMatch) {
        return shortFormatMatch[1];
      }
      // If no match is found, return null
      return null;
    };
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>تعديل محتوي الفيديو </DialogTitle>
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
      <TextField
        label="url"
        value={editItem.url}
        onChange={(e) => setEditItem({ ...editItem, url: e.target.value })}
        fullWidth
        margin="normal"
      />
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
          <InputLabel htmlFor="video">الفيديو</InputLabel>
          <Select
            id="video"
            value={editItem.imageId}
            onChange={(e) => setEditItem({ ...editItem, videoId: e.target.value })}
          >
            {videos.map((video) => (
              <MenuItem key={video.id} value={video.id}>
              <YouTube videoId={getVideoIdFromUrl(video.url)} opts={opts} onError={(e) => console.error('YouTube Error', e)} />
               
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
