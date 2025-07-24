import React from 'react'
import Humb from "../../assets/icons/Humb.png"
import logo from "../../assets/Logos/logo.png"
import Drop from "../../assets/icons/Drop.png"
import Cam from "../../assets/icons/Cam.png"
import Heart from "../../assets/icons/Heart.png"
import SearchIcon from "../../assets/icons/SearchIcon.png"
import User from "../../assets/icons/User.png"

const NavBar = ({ onOpenSidebar }) => {
  return (
    <nav className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-6 ml-2 sm:ml-4 md:ml-8">
        <button className="cursor-pointer hover:opacity-75 transition" onClick={onOpenSidebar}>
          <img src={Humb} alt="Menu" className="w-7 h-7 " />
        </button>
        <button className="cursor-pointer hover:opacity-75 transition">
        <img src={logo} alt="Logo" className="h-9 w-auto sm:h-12" />
        </button>
      </div>

      <div className="flex-1 mx-2 max-w-xl  lg:flex ">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mx-4 hidden sm:block" />
          <input
            type="text"
            placeholder="Search models"
            className="flex-1 h-12 w-auto bg-transparent focus:outline-none text-base text-gray-700"
          />
          <button className="cursor-pointer hover:opacity-75 transition">
            <img src={Cam} alt="Camera" className="w-6 h-6 mx-4 " />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-6 sm:space-x-4 lg:space-x-12 mr-2  md:mr-6">
        <button className="cursor-pointer hover:opacity-75 transition">
          <img src={Heart} alt="Favorites" className="w-10 h-10 hidden lg:block " />
        </button>
        <div className="flex items-center space-x-3 border rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm text-gray-800">
          <button className="cursor-pointer hover:opacity-75 transition flex items-center px-1 hidden sm:flex">
          <img src={User} alt="User" className="w-7 h-7 sm:w-8 h-8 flex mx-1 " />
          <span className="hidden sm:block text-base sm:text-lg">User</span>
            <img src={Drop} alt="Dropdown" className="hidden sm:flex w-3 h-2 my-3 ml-4 mt-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
