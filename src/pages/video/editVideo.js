import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ReactPlayer from 'react-player';
import { useDropzone } from 'react-dropzone';

export default function EditVideo({ open, itemId, onClose }) {
  const [editedVideo, setEditedVideo] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'video/*',
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const fetchItemDetails = async () => {
    try {
      const response = await axiosInstance.get(`/Video/Get?id=${itemId}`);
      setEditedVideo(response.data.data.url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);
  // Convert Blob to String Url  
  // const blobToDataURL = (blob) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       resolve(reader.result);
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // };
  const handleEdit = async () => {
    try {
      if (playerReady) {
        console.log(playerReady);
        const blobUrl = URL.createObjectURL(selectedFile);
        setEditedVideo(blobUrl);
      }
      const blobUrl = URL.createObjectURL(selectedFile);
      const cleanUrl = blobUrl.replace(/^blob:/, '');
      await axiosInstance.put(`/Video/Update?id=${itemId}`, {
        url: cleanUrl,
      });

      console.log(cleanUrl);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>تعديل الفيديو</DialogTitle>
      <DialogContent>
        <div {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #ccc' }}>
          <input {...getInputProps()} />
          <p>اسحب وأسقط الفيديو هنا أو انقر لتحديده</p>
        </div>
        {selectedFile ? (
          <ReactPlayer
            url={URL.createObjectURL(selectedFile)}
            controls={true}
            width="50%"
            height="50%"
          />
        ) : (
          <ReactPlayer
            url={editedVideo}
            controls={true}
            width="50%"
            height="50%"
          />
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
  );
}
