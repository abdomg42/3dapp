import React from 'react';
import NavBar from './components/User/NavBar';
import NavBarAdmin from './components/admin/NavBarAdmin';
import SideBar from './components/User/SideBar';
import SideBarAdmin from './components/admin/SideBarAdmin';
import ProductCard from './components/ProductCard';
import Home from './Pages/Home';
import Footer from './components/Footer';
import ProductPage from './Pages/ProductPage';
import {Routes, Route} from "react-router-dom";
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import UploadPage from './components/admin/UploadPage';
const App = () => {
  return (
    <div className='min-h-screen bg-zinc-200 transition-colors duration-300' >
      <Home/>
      {/* <NavBar/>
      <Footer/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/product/:id' element={<ProductPage/>} />
    </Routes> */}
    {/* <Login/> */}
    <NavBarAdmin/>
    <UploadPage/>
    {/* <ProductCard image="https://img.freepik.com/photos-gratuite/angle-eleve-feuilles-pilules-recipients-plastique_23-2148533456.jpg?semt=ais_hybrid&w=740" name="Product 1" onDownload={() => {}} onDetails={() => {}} onFavorite={() => {}} isFavorite={false} /> */}
    {/* <SideBarAdmin/> */}
    </div>
  )
}

export default App
