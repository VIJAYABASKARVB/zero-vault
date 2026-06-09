import logo from "../assets/logo.png"
import { FaSearch } from "react-icons/fa";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useRef } from 'react'

function Navbar({searchQuery,onSearchChange}) {
  const inputRef = useRef(null)
  return (
    <div className="sticky top-0 z-50 p-5 grid grid-cols-[1fr_auto_1fr] items-center gap-5 backdrop-blur-sm bg-black/20">

      {/* LOGO AND BRAND NAME */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-9 w-auto"
        />
        <h1 className="text-2xl font-bold text-white font-jet">ZERO VAULT</h1>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="flex items-center gap-2 border-[#008B1E] border-2 p-2 rounded-lg font-jet w-[28rem] focus-within:border-white hover:border-white">

        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text" 
          placeholder="Search" 
          className="text-white bg-transparent outline-none w-full placeholder:text-gray-500"
        />
        <FaSearch 
          onClick={()=>inputRef.current?.focus()}
          className="text-gray-400 cursor-pointer"
        />

      </div>

      {/* USER BUTTON SECTION */}
      <div className="flex justify-end">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </div>
  )
}

export default Navbar