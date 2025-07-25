import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { Toaster } from "react-hot-toast";

import NavBar from './components/User/NavBar';
import NavBarAdmin from './components/admin/NavBarAdmin';
import SideBar from './components/User/SideBar';
import SideBarAdmin from './components/admin/SideBarAdmin';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import UploadPage from './Pages/admin/UploadPage';

import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';

const App = () => {
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
    };
  
  return (
    <div className='min-h-screen max-w-8xl mx-auto bg-zinc-200 transition-colors duration-300' >
     <SideBar  isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NavBar onOpenSidebar={toggleSidebar} />
      {/* <NavBarAdmin onOpenSidebar={toggleSidebar} />
      <SideBarAdmin isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/upload" element={<UploadPage />} />
        <Route path="/admin/SideBarAdmin" element={<SideBarAdmin />} />
      </Routes>
      <Footer />
      <Toaster/>
  </div>
  )
}

export default App
