// import React from 'react'
// import { Button } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import MenuIcon from '@mui/icons-material/Menu';
// import artificial_intelligence from '../assets/artificial_intelligence_image.png';

// function Sidebar() {
//   return (
//     <div className="sidebar" style={{ width: '15%', height: '100vh', backgroundColor: '#f4f4f4', padding: '20px', position: 'fixed', left: 0, top: 0 }}>
//       <img src={artificial_intelligence} alt='artificial intelligence' style={{ width: '80%', padding: '20px', margin: '0 auto', display: 'block' }} />
//       <Button startIcon={<MenuIcon />} style={{ width: '100%', marginBottom: '10px' }}>
//         AI-HUB
//       </Button>
//       <Button startIcon={<DashboardIcon />} style={{ width: '100%', marginBottom: '10px' }}>
//         Kho dịch vụ
//       </Button>
//     </div>
//   )
// }

// export default Sidebar


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