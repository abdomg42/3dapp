import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Humb from "../assets/icons/Humb.png"
import logo from "../assets/Logos/logo.png"
import Drop from "../assets/icons/Drop.png"
import Heart from "../assets/icons/Heart.png"
import User from "../assets/icons/User.png"
import { useUserStore } from '../store/UserStore';
import Upload from "../assets/icons/Upload.png"
import SearchBar from './SearchBar';

const NavBar = ({ onOpenSidebar, onOpenImageModal  }) => {

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const {user} = useUserStore();
  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-6 ml-2 sm:ml-4 md:ml-8">
        <button className="cursor-pointer hover:opacity-75 transition" onClick={onOpenSidebar}>
          <img src={Humb} alt="Menu" className="w-7 h-7 " />
        </button>
        <Link to="/" className="cursor-pointer hover:opacity-75 transition">
        <img src={logo} alt="Logo" className="h-9 w-auto sm:h-12" />
        </Link>
      </div>

      <SearchBar
          onOpenImageModal={onOpenImageModal}
        />

      <div className="flex items-center space-x-6 sm:space-x-4 lg:space-x-12 mr-2  md:mr-6">
      {isAdmin && (
          <Link to="/admin/upload" className="cursor-pointer hover:opacity-75 transition">
            <img src={Upload} alt="Upload" className="w-10 h-10 hidden lg:block " />
          </Link>
        )}
        <Link to="/favourites" className="cursor-pointer hover:opacity-75 transition">
          <img src={Heart} alt="Favorites" className="w-10 h-10 hidden lg:block " />
        </Link>
        <div className="flex items-center space-x-3 border rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm text-gray-800">
          <button className="cursor-pointer hover:opacity-75 transition items-center px-1 sm:flex">
          <img src={User} alt="User" className="w-7 h-7 sm:w-8:h-8 flex mx-1 " />
          <span className="hidden sm:block text-base sm:text-lg  pl-2 ">
            {user?.name  || (isAdmin ? 'Admin' : 'User')}
          </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
