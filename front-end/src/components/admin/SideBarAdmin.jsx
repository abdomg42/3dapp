import React from 'react';
import BigLogo from '../../assets/Logos/BigLogo.png';
import Dashboard from '../../assets/icons/Dashboard.png';
import Upload from '../../assets/icons/Upload.png';
import FavIcon from '../../assets/icons/Fav.png';
import LogoutIcon from '../../assets/icons/Logout.png';
import UserIcon from '../../assets/icons/User.png';
import HumbL from '../../assets/icons/HumbL.png';

const SidebarAdmin = ({ isOpen, onClose }) => {
  return (
  <div
      className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#D9D9D9] py-6 px-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >           {/* Top: Logo and Hamburger */}
      <div>
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col items-center">
            <img src={BigLogo} alt="MK Studios Logo" className="w-32 h-32 object-contain mb-1" />
          </div>
          {/* Hamburger icon */}
          <button onClick={onClose} className=" cursor-pointer focus:outline-none">
            <img src={HumbL} alt="Close Sidebar" className="w-10 h-10 object-contain" />
          </button>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col gap-10 mt-10">
          <a href="#" className="flex items-center gap-4 text-xl text-[#7A6B3F] font-medium hover:opacity-80">
            <img src={Dashboard} alt="Dashboard" className="w-7 h-7" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-4 text-xl text-[#7A6B3F] font-medium hover:opacity-80">
            <img src={Upload} alt="Uplaod" className="w-7 h-7" />
            Upload
          </a>
          <a href="#" className="flex items-center gap-4 text-xl text-[#7A6B3F] font-medium hover:opacity-80">
            <img src={FavIcon} alt="Favorites" className="w-7 h-9 " />
            Favorits
          </a>
          <a href="#" className="flex items-center gap-4 text-xl text-[#7A6B3F] font-medium hover:opacity-80">
            <img src={LogoutIcon} alt="Log out" className="w-7 h-7 ml-2" />
            Log out
          </a>
        </nav>
      </div>
      {/* Bottom: User bar */}
      <div className="w-full flex items-center  bg-white border border-[#7A6B3F] rounded-full px-6 py-2 ">
        <img src={UserIcon} alt="User" className="w-7 h-7 " />
        <span className="text-xl text-[#7A6B3F] font-medium ml-2 text-center justify-center ml-8">Admin</span>
      </div>
    </div>
  );
};

export default SidebarAdmin;