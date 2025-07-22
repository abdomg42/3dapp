import React from 'react'
import BigLogo from '../assets/Logos/BigLogo.png'
import linkedin from '../assets/icons/linkedin.png'
import x from '../assets/icons/x.png'
import instagram from '../assets/icons/instagram.png'
import facebook from '../assets/icons/facebook.png'


const Footer = () => {
  return (
    <footer className="w-full sticky bottom-0 left-0 bg-[#35363A] text-[#E6E6E6] pt-8 pb-4 px-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-start gap-8 md:gap-24">
     
        <div className="flex flex-col items-start md:w-1/3">
          <div className="flex flex-col items-start ">
            <img src={BigLogo} alt="Logo" className="w-44 h-32 object-contain mb-2" />
          </div>
          <div className="flex space-x-8 mt-1">
            <a href="#" aria-label="LinkedIn"><img src={linkedin} alt="LinkedIn" className="w-7 h-7" /></a>
            <a href="#" aria-label="X"><img src={x} alt="X" className="w-7 h-7" /></a>
            <a href="#" aria-label="Instagram"><img src={instagram} alt="Instagram" className="w-7 h-7" /></a>
            <a href="#" aria-label="Facebook"><img src={facebook} alt="Facebook" className="w-7 h-7" /></a>
          </div>
        </div>
        <div className="flex flex-row flex-1 justify-between w-full md:w-auto gap-24">
          <div className="flex flex-col items-start">
            <span className="mb-4 text-2xl font-bold text-[#D6C16B] mb-2 whitespace-nowrap">Contact</span>
            <span className="mb-4 text-xl">Mkstudios.Maroc@gmail.com</span>
            <span className="text-xl">+212 663 135 593</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-[#D6C16B] mb-2 whitespace-nowrap">Adresse</span>
            <span className="text-xl">2ème étage, N° 6,</span>
            <span className="text-xl">Boulevard Yacoub El Mansour,</span>
            <span className="text-xl">Imm 159, Entrée B,</span>
            <span className="text-xl">Casablanca 20380</span>
          </div>
        </div>
      </div>
      <div className="w-full text-center text-lg mt-6 text-[#E6E6E6]">
        © All Copyright 2025 by Mk Studios Maroc
      </div>
    </footer>
  )
}

export default Footer