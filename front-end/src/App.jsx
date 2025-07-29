import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate, Link} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import NavBar from './components/User/NavBar';
import SideBar from './components/User/SideBar';
import Footer from './components/Footer';
import UploadPage from './Pages/admin/UploadPage';
import Dashboard from './Pages/admin/Dashboard';

import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage';
import Favourits from './Pages/Favourits';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import SignUpSuccess from './Pages/Auth/SignUpSuccess';
import CategoryFilter from './Pages/CategoryFilter';
import FormatFilter from './Pages/FormatFilter';
import LogicielFilter from './Pages/LogicielFilter';
import SearchResults from './Pages/SearchResults';
import { useUserStore } from './store/UserStore';

const App = () => {
  const location = useLocation();
  const { user, checkAuth, checkingAuth } = useUserStore();
  const isAdmin = user?.role === "admin";

  // Pages that don't require authentication
  const publicPages = ["/login", "/signup", "/signup-success"];
  const hideNavAndFooter = publicPages.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };



  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-200">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!user && !publicPages.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className='min-h-screen max-w-8xl mx-auto bg-zinc-200 transition-colors duration-300'>
      {/* Only show navigation for authenticated users */}
      {user && !hideNavAndFooter && <NavBar onOpenSidebar={toggleSidebar} />}
      
      {user && !hideNavAndFooter && <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
     
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to='/' /> : <Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-success" element={<SignUpSuccess />} />
        
        {/* Protected routes - only render if user is authenticated */}
        {user && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/favourites" element={<Favourits />} />
            <Route path="/admin/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/admin/upload" element={<UploadPage />} />
            <Route path="/category/:categoryName" element={<CategoryFilter />} />
            <Route path="/format/:formatName" element={<FormatFilter />} />
            <Route path="/logiciel/:logicielName" element={<LogicielFilter />} />
            <Route path="/search" element={<SearchResults />} />
          </>
        )}
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      {/* Only show footer for authenticated users */}
      {user && !hideNavAndFooter && <Footer />}
      <Toaster toastOptions={{className: '', style: {border: '1px solid #713200',padding: '18px',color: '#713200'}}}/>
    </div>
  );
};

export default App;
