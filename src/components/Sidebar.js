// import React from 'react'

// function Sidebar() {
//     return (
//         <div className="sidebar">
//             <h6>AI-HUB</h6>
//             <ul>
//                 <li><a href="#home">Home</a></li>
//                 <li><a href="#services">Services</a></li>
//                 <li><a href="#clients">Clients</a></li>
//                 <li><a href="#contact">Contact</a></li>
//             </ul>
//         </div>
//     )
// }

// export default Sidebar

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import artificial_intelligence from '../assets/artificial_intelligence_image.png';

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src={artificial_intelligence} alt='artificial intelligence' style={{ width: '80%', padding: '20px' }} />
        <ListItem button>
          <ListItemIcon style={{  }}><MenuIcon /></ListItemIcon>
          <ListItemText primary="AI-HUB" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Kho dịch vụ" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
