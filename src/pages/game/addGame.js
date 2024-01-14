import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';

export default function AddGame({ open, onClose, onAdd }) {
    const [newItem, setNewItem] = useState({
        id:0,
        name: '',
      });
    
      const handleAdd = async () => {
        try {
          const response = await axiosInstance.post('/Game/Create', newItem);
          onAdd(response.data); 
          onClose(); 
        } catch (error) {
          console.log(error);
         
        }
      };
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>اضافة لعبه جديد</DialogTitle>
    <DialogContent>
      <TextField
        label="الاسم"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
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
