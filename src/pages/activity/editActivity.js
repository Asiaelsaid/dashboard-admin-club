import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosConfig/instance';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function EditActivity({open, itemId, onClose }) {
    const [editedName, setEditedName] = useState('')
      //get item details
      const fetchItemDetails = async () => {
        try {
          const response = await axiosInstance.get(`/Activity/Get?id=${itemId}`);
          // console.log(response.data.data);
          setEditedName(response.data.data.name);
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
        fetchItemDetails();
      }, [itemId]);
      const handleEdit = async () => {
        try {
          await axiosInstance.put(`/Activity/Update?id=${itemId}`, { name: editedName });
          onClose();
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>تعديل النشاط</DialogTitle>
    <DialogContent>
      <TextField
        label="الاسم"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        fullWidth
        margin="normal"
      />
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
