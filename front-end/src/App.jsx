import React from 'react';
import { Routes, Route } from "react-router-dom";


import NavBar from './components/User/NavBar';
import NavBarAdmin from './components/admin/NavBarAdmin';
import SideBar from './components/User/SideBar';
import SideBarAdmin from './components/admin/SideBarAdmin';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import UploadPage from './components/admin/UploadPage';


import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';

const App = () => {
  return (
    <div className='min-h-screen bg-zinc-200 transition-colors duration-300' >
   
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/upload" element={<UploadPage />} />
      </Routes>
      <Footer />
   
  </div>
  )
}

export default App
