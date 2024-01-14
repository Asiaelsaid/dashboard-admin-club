import React, { useState } from 'react'
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const drawerWidth = 250;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout());
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/');
    }
  };
  const list = [{ name: 'القائمه الرئيسيه', to: '/navbar' }, { name: 'الانشطه', to: '/activity' }, { name: 'الالعاب', to: "/game" }, { name: 'الصور', to: "/image" }, { name: 'محتوي الصور', to: '/imageContents' }, { name: 'نوع الخبر', to: '/newsType' }, { name: 'الفيديوهات', to: "/video" }, { name: 'محتوي الفيديوهات', to: '/videoContents' }]
  const drawer = (
    <div>
    

    <Button variant="contained" color="error" sx={{ textTransform: 'lowercase',margin: "2% 32%" ,padding:"3px 12px"}}  onClick={handleLogout}>
        تسجيل خروج
      </Button>
      <Divider />
      <List>
        {list.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemText primary={item.name} onClick={() => { navigate(item.to) }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </div>
  );


  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display:{sm:'none'},

        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >

        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

    </Box>
  );
}

Sidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};


