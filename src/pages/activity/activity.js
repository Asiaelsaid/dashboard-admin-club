import React, { useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,styled, tableCellClasses } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import Swal from 'sweetalert2';
import EditActivity from './editActivity';
import AddActivity from './addActivity';

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

export default function Activity() {
  //variables
  const [activities, setActivities] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isAddPageOpen, setAddPageOpen] = useState(false);

 
  function createData(id, name) {
    return { id, name };
  }
  //get data
  const getActivity = async () => {
    try {
      const response = await axiosInstance.get('/Activity/GetAll')
      setActivities(response.data.data)
      // console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getActivity()
  }, [])
  //delete activity
  const deleteRow = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل حقا تريد حذف هذا النشاط ؟',
        text: '! لن تتمكن من استرجاع هذا النشاط',
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
        await axiosInstance.delete(`/Activity/Delete?id=${id}`);

        // After successful deletion, update the state to reflect the change
        setActivities((prevActivity) => prevActivity.filter((item) => item.id !== id));

        // Show success message
        Swal.fire('تم الحذف', 'تم حذف هذها النشاط', 'success');
      }
    } catch (error) {
      console.log(error);

      // Show error message if something goes wrong
      Swal.fire('خطأ', 'لم نتمكن من حذف هذا العنصر', 'error');
    }
  };
  //edit activity
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
    setActivities([...activities, newItem]);
  };
  const rows = activities.map((item) => createData(item.id, item.name));
  useEffect(() => {
    getActivity()
  }, [activities.length])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '60%', margin: "2% auto" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell >الاسم</StyledTableCell>
            <StyledTableCell >تعديل </StyledTableCell>
            <StyledTableCell >حذف</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell >{row.name}</StyledTableCell>
              <StyledTableCell >
                <Button variant="contained" sx={{ textTransform: 'lowercase' }}  onClick={() => handleEditClick(row.id)}>تعديل</Button>
              </StyledTableCell>
              <StyledTableCell >
                <Button variant="contained" color="error" sx={{ textTransform: 'lowercase' }} onClick={()=>{deleteRow(row.id)}}>
                  حذف
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        {editingItemId !== null && (
        <EditActivity open={true}  onClose={handleCloseEdit} itemId={editingItemId} />
      )}
       <Button onClick={handleAddClick} color="success" variant="contained" sx={{margin:"10% 0"}}>
      اضافه جديد
      </Button>

      {isAddPageOpen && (
        <AddActivity  open={true} onClose={handleCloseAdd} onAdd={handleAdd} />
      )}
      </Table>
    </TableContainer>
    
  )
}
