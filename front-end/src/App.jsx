import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate} from "react-router-dom";
import { useState } from 'react';
import { Toaster } from "react-hot-toast";

import NavBar from './components/User/NavBar';
import SideBar from './components/User/SideBar';
import SideBarAdmin from './components/admin/SideBarAdmin';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import UploadPage from './Pages/admin/UploadPage';

import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import SignUpSuccess from './Pages/Auth/SignUpSuccess';
import { useUserStore } from './store/UserStore';

const App = () => {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/signup", "/signup-success"].includes(location.pathname);
  const { user ,checkAuth} = useUserStore();
  const isAdmin = user && user.role === "admin";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    checkAuth();
  },[checkAuth])
  return (
    <div className='min-h-screen max-w-8xl mx-auto bg-zinc-200 transition-colors duration-300' >
      {/* NavBar for all except login/signup/success */}
      {!hideNavAndFooter && <NavBar onOpenSidebar={toggleSidebar} />}
      {/* Sidebar: show admin or user version based on role */}
      {!hideNavAndFooter && <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/login" element={user ? <Navigate to='/' /> :<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-success" element={<SignUpSuccess />} />
        <Route path="/admin/upload" element={<UploadPage />} />
        <Route path="/admin/SideBarAdmin" element={<SideBarAdmin />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
      <Toaster toastOptions={{className: '', style: {border: '1px solid #713200',padding: '18px',color: '#713200'}}}/>
    </div>
  )
}

export default App
