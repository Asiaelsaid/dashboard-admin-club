import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';

export default function AddVideo({ open, onClose, onAdd }) {
    const [newItem, setNewItem] = useState({
        id:0,
        url: '',
      });
      const handleAdd = async () => {
        try {
          const response = await axiosInstance.post('/Video/Create', newItem);
          onAdd(response.data); 
          onClose(); 
        } catch (error) {
          console.log(error);
         
        }
      };
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>اضافة فيديو جديد</DialogTitle>
    <DialogContent>
      <TextField
        label="url"
        value={newItem.url}
        onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
        fullWidth
        margin="normal"
      />
    
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
