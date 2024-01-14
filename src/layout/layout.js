import React from 'react'
import Grid from '@mui/material/Grid';
import Sidebar from '../components/sidebar/sidebar';
export default function Layout({children}) {
  return (
    <Grid container spacing={2}>
        <Grid item md={2} xs={0}>
<Sidebar/>
        </Grid>
        <Grid item md={10} xs={12} sx={{ mt: { md:'0',xs: '10%' } }}>
{children}
        </Grid>
      </Grid>
  )
}
