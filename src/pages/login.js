import {  Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {loginAsync, selectError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router';
export default function Login() {
   const navigate = useNavigate();
   const error = useSelector(selectError);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
    const handleSubmit =async  (e) => {
        e.preventDefault();
        await dispatch(loginAsync({ email, password }));
        const storedToken = localStorage.getItem('token');
          if (storedToken) {
            navigate('/navbar');
          }      
      };
      
  return (
    <Box    sx={{width:'40%',textAlign:"center" ,margin:"1% auto"}}>
 <form onSubmit={handleSubmit} >
    <TextField
      label="الايميل"
      variant="outlined"
      fullWidth
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      margin="normal"
   
    />
    <TextField
      label="باسورد"
      type="password"
      variant="outlined"
      fullWidth
      value={password} 
      onChange={(e) => setPassword(e.target.value)}
      margin="normal"
    />
    <Button type="submit" variant="contained" color="primary" >
      تسجيل دخول
    </Button>
 
    {error && <div style={{ color: 'red' }}>الايميل غير صالح</div>} 
    
  </form>
    </Box>
   
  )
}
