import React from 'react';
import AppNavbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Layout({ children }) {
  return (
    <div className="" >
        <AppNavbar/>
        <Sidebar />
        {children}
    </div>
  );
}

export default Layout;
