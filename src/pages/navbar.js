import React, {  useEffect, useState } from 'react'
import {Box,Button,TextField} from '@mui/material';
import axiosInstance from '../axiosConfig/instance';

export default function Navbar() {
    const [updatedData, setUpdatedData] = useState({
      activity: '',
      game: '',
      videosAndImages: '',
      womenAndChildren: '',
      aboutUs: '',
      centerServices: '',
      peopleWithAbilities: '',
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleUpdate = async () => {
      try {
      
        const response = await axiosInstance.put('/Navbar/Update?id=1', updatedData);
        console.log('Update successful', response.data);
      } catch (error) {
        console.error('Error updating data', error);
      }
    };
   const getNavbar=async ()=>{
try{
const response =await axiosInstance.get('/Navbar/GetAll')
setUpdatedData((prevData)=>({
  ...prevData,
  aboutUs:response.data.data[0].aboutUs,
  activity: response.data.data[0].activity,
      game: response.data.data[0].game,
      videosAndImages:response.data.data[0].videosAndImages,
      womenAndChildren:response.data.data[0].womenAndChildren,
      centerServices: response.data.data[0].centerServices,
      peopleWithAbilities: response.data.data[0].peopleWithAbilities,
}))
}catch(error){
console.log(error)
}
   }
    useEffect(()=>{
 getNavbar()
    },[])
  return (
    <>
     <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width:{md: '50%',xs:"70%" }},
        textAlign:'center',
       
      }}
      
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label="Activity"
        variant="outlined"
        name="activity"
        value={updatedData.activity}
        onChange={handleInputChange}
      />
      <TextField
        id="outlined-basic"
        label="Game"
        variant="outlined"
        name="game"
        value={updatedData.game}
        onChange={handleInputChange}
      />
     <TextField
        id="outlined-basic"
        label="Videos And Images"
        variant="outlined"
        name="videosAndImages"
        value={updatedData.videosAndImages}
        onChange={handleInputChange}
      />
      <TextField
        id="outlined-basic"
        label="Women And Children"
        variant="outlined"
        name="womenAndChildren"
        value={updatedData.womenAndChildren}
        onChange={handleInputChange}
      />
       <TextField
        id="outlined-basic"
        label="AboutUs"
        variant="outlined"
        name="aboutUs"
        value={updatedData.aboutUs}
        onChange={handleInputChange}
      />
 
      <TextField
        id="outlined-basic"
        label="Center Services"
        variant="outlined"
        name="centerServices"
        value={updatedData.centerServices}
        onChange={handleInputChange}
      />
      <TextField
        id="outlined-basic"
        label="People With Abilities"
        variant="outlined"
        name="peopleWithAbilities"
        value={updatedData.peopleWithAbilities}
        onChange={handleInputChange}
      />
  

      <Box sx={{ margin: '2% auto', width: 'auto !important' }}>
        <Button variant="contained" onClick={handleUpdate}>
          تعديل
        </Button>
      </Box>
    </Box>
    </>
  )
}
