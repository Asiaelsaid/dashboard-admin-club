import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import YouTube from 'react-youtube';

export default function AddVideoContent({ open, onClose, onAdd }) {
    const [newsTypes, setNewsTypes] = useState([]);
  const [videos, setVideos] = useState([]);
    const [newItem, setNewItem] = useState({
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
      //get data from api
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
      //add new content
      const handleAdd = async () => {
        try {
          const response = await axiosInstance.post('/VideoContents/Create', newItem);
          onAdd(response.data); 
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
    <Dialog open={open} onClose={onClose} maxWidth='500px !important'>
    <DialogTitle>اضافة محتوي فيديو جديد </DialogTitle>
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
      <TextField
        label="url"
        value={newItem.url}
        onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
        fullWidth
        margin="normal"
      />
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
          <InputLabel htmlFor="video">الفيديو</InputLabel>
          <Select
            id="video"
            value={newItem.videoId}
            onChange={(e) => setNewItem({ ...newItem, videoId: e.target.value })}
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
