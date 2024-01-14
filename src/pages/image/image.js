import React, { useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,styled, tableCellClasses } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import Swal from 'sweetalert2';
import EditIamge from './editIamge';
import AddIamge from './addIamge';
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
export default function Image() {
    //variables
  const [iamges, setIamges] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isAddPageOpen, setAddPageOpen] = useState(false);


  function createData(id, url) {
    return { id, url };
  }
  //get data
  const getIamges = async () => {
    try {
      const response = await axiosInstance.get('/Image/GetAll')
      setIamges(response.data.data)
      // console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getIamges()
  }, [])
  //delete iamge
  const deleteRow = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل حقا تريد حذف هذه الصوره ؟',
        text: '! لن تتمكن من استرجاع هذه الصوره',
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
        await axiosInstance.delete(`/Image/Delete?id=${id}`);

        // After successful deletion, update the state to reflect the change
        setIamges((prevIamge) => prevIamge.filter((item) => item.id !== id));

        // Show success message
        Swal.fire('  ! تم الحذف' , 'تم حذف هذه الصوره', 'success');
      }
    } catch (error) {
      console.log(error);

      // Show error message if something goes wrong
      Swal.fire('Error', 'An error occurred while deleting the row.', 'error');
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
    setIamges([...iamges, newItem]);
  };
  const rows = iamges.map((item) => createData(item.id, item.url));
  useEffect(() => {
    getIamges()
  }, [rows.length])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '60%', margin: "2% auto" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell >الصور</StyledTableCell>
            <StyledTableCell >تعديل </StyledTableCell>
            <StyledTableCell >حذف</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>

              <StyledTableCell >
                <img src={row.url} alt='img row' width={50}/>
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
      <EditIamge open={true}  onClose={handleCloseEdit} itemId={editingItemId} />
    )}
         <Button onClick={handleAddClick} color="success" variant="contained" sx={{margin:"10% 0"}}>
      اضافه جديد
      </Button>

        {isAddPageOpen && (
      <AddIamge  open={true} onClose={handleCloseAdd} onAdd={handleAdd} />
    )}
      </Table>
    </TableContainer>
  )
}
