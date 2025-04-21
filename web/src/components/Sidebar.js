import React from 'react';
import { Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import artificial_intelligence from '../assets/artificial_intelligence_image.png';
import '../css/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <img src={artificial_intelligence} alt='artificial intelligence' className="sidebar-image" />
      <Button startIcon={<MenuIcon />} className="sidebar-button">
        AI-HUB
      </Button>
      <Button startIcon={<DashboardIcon />} className="sidebar-button">
        Kho dịch vụ
      </Button>
    </div>
  )
}

export default Sidebar;