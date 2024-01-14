import React, { useEffect, useState } from 'react'
import {  Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import Swal from 'sweetalert2';
import AddIamgeContent from './addIamgeContent';
import EditIamgeContent from './editIamgeContent';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    width: '70%'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export default function ImageContents() {
  //variables
  const [imageContent, setImageContent] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isAddPageOpen, setAddPageOpen] = useState(false);
  function createData(id, title, description, date, newsType, url,imageUrl) {
    return { id, title, description, date, newsType, url ,imageUrl};
  }
  //get data
  const getImageContents = async () => {
    try {
      const response = await axiosInstance.get('/ImageContents/GetAll')
      setImageContent(response.data.data)
      // console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getImageContents()
  }, [])
  //delete iamge
  const deleteRow = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل حقا تريد حذف هذا المحتوي ؟',
        text: '! لن تتمكن من استرجاع هذا المحتوي',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'نعم',
        cancelButtonText: 'إلغاء'
      });

      // If the user confirms, proceed with deletion
      if (result.isConfirmed) {
        // Send a DELETE request to the API
        await axiosInstance.delete(`/ImageContents/Delete?id=${id}`);

        // After successful deletion, update the state to reflect the change
        setImageContent((prevContent) => prevContent.filter((item) => item.id !== id));

        // Show success message
        Swal.fire(' !تم الحذف ', 'تم حذف هذا المحتوي', 'success');
      }
    } catch (error) {
      console.log(error);

      // Show error message if something goes wrong
      Swal.fire('خطأ', 'لم نتمكن من حذف هذا العنصر', 'error');
    }
  };
  //edit image
  const handleEditClick = (itemId) => {
    setEditingItemId(itemId);
  };
  const handleCloseEdit = () => {
    setEditingItemId(null);
  };

  //add new item
  const handleAddClick = () => {
    setAddPageOpen(true);
  };

  const handleCloseAdd = () => {
    setAddPageOpen(false);
  };

  const handleAdd = (newItem) => {
    setImageContent([...imageContent, newItem]);
  };
  const rows = imageContent.map((item) => {
    return createData(item.id, item.title, item.description, item.date, item.newsType.name, item.image.url)
  });
  //format date
  const formatDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);
    const formattedDate = `${inputDate.getFullYear()}-${(inputDate.getMonth() + 1).toString().padStart(2, '0')}-${inputDate.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  };
  useEffect(() => {
    getImageContents()
  }, [rows.length])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '60%', margin: "2% auto" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell >العنوان</StyledTableCell>
            <StyledTableCell >الوصف</StyledTableCell>
            <StyledTableCell >التاريخ</StyledTableCell>
            <StyledTableCell >نوع الخبر </StyledTableCell>
            <StyledTableCell >الصور</StyledTableCell>
            <StyledTableCell >تعديل </StyledTableCell>
            <StyledTableCell >حذف</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>

              <StyledTableCell >
              {truncateText(row.title, 15)} 
              </StyledTableCell>
              <StyledTableCell >
              {truncateText(row.description, 40)} 
              </StyledTableCell>
              <StyledTableCell >
              {formatDate(row.date)}
              </StyledTableCell>
              <StyledTableCell >
                {row.newsType}
              </StyledTableCell>
              <StyledTableCell >
                <img src={row.url || row.imageUrl} alt='img row' width={50} />
              </StyledTableCell>
              <StyledTableCell >
                <Button variant="contained" sx={{ textTransform: 'lowercase' }} onClick={() => handleEditClick(row.id)}>تعديل</Button>
              </StyledTableCell>
              <StyledTableCell >
                <Button variant="contained" color="error" sx={{ textTransform: 'lowercase' }} onClick={() => { deleteRow(row.id) }}>
                  حذف
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        {editingItemId !== null && (
        <EditIamgeContent open={true}  onClose={handleCloseEdit} itemId={editingItemId} />
      )}
      <Button onClick={handleAddClick} color="success" variant="contained" sx={{margin:"10% 0"}}>
      اضافه جديد
      </Button>
          
          {isAddPageOpen && (
        <AddIamgeContent  open={true} onClose={handleCloseAdd} onAdd={handleAdd} />
      )}
      </Table>
    </TableContainer>
  )
}
