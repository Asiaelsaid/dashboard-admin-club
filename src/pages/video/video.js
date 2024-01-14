import React, { useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material'
import axiosInstance from '../../axiosConfig/instance';
import Swal from 'sweetalert2';
import AddVideo from './addVideo';
import EditVideo from './editVideo';
import ReactPlayer from 'react-player';

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
export default function Video() {
  //variables
  const [videos, setVideos] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isAddPageOpen, setAddPageOpen] = useState(false);
  function createData(id, url) {
    return { id, url };
  }
  // //video options 
  // const opts = {
  //   height: '100',
  //   width: '150',
  //   playerVars: {
  //     autoplay: 1,
  //   },
  // };
  //get data
  const getVideos = async () => {
    try {
      const response = await axiosInstance.get('/Video/GetAll')
      setVideos(response.data.data)
      // console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getVideos()
  }, [])
  //delete iamge
  const deleteRow = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل حقا تريد حذف هذا الفيديو  ؟',
        text: '!لن تتمكن من استرجاع هذا الفيديو',
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
        await axiosInstance.delete(`/Video/Delete?id=${id}`);

        // After successful deletion, update the state to reflect the change
        setVideos((prevVideo) => prevVideo.filter((item) => item.id !== id));

        // Show success message
        Swal.fire('  ! تم الحذف', 'تم حذف هذا الفيديو ', 'success');
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
    setVideos([...videos, newItem]);
  };
  const rows = videos.map((item) => createData(item.id, item.url));
  useEffect(() => {
    getVideos()
  }, [rows.length])
  //video functions 
  // const getVideoIdFromUrl = (url) => {
  //   const fullUrlMatch = url.match(/[?&]v=([^?&]+)/);
  //   if (fullUrlMatch) {
  //     return fullUrlMatch[1];
  //   }
  //   // Check if the URL is in the short format (/watch?v=VIDEO_ID)
  //   const shortUrlMatch = url.match(/\/watch\?v=([^?&]+)/);
  //   if (shortUrlMatch) {
  //     return shortUrlMatch[1];
  //   }
  //   const shortFormatMatch = url.match(/youtu\.be\/([^?&]+)/);
  //   if (shortFormatMatch) {
  //     return shortFormatMatch[1];
  //   }
  //   // If no match is found, return null
  //   return null;
  // };

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
              <StyledTableCell>
                <ReactPlayer
                  url={row.url}
                  controls={true}
                  width="50%"
                  height="50%"
                />

                {/* <YouTube videoId={getVideoIdFromUrl(row.url)} opts={opts} onError={(e) => console.error('YouTube Error', e)} /> */}
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
          <EditVideo open={true} onClose={handleCloseEdit} itemId={editingItemId} />
        )}
        <Button onClick={handleAddClick} color="success" variant="contained" sx={{ margin: "10% 0" }}>
          اضافه جديد
        </Button>

        {isAddPageOpen && (
          <AddVideo open={true} onClose={handleCloseAdd} onAdd={handleAdd} />
        )}
      </Table>
    </TableContainer>
  )
}
