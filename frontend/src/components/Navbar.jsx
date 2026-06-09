import logo from "../assets/logo.png"
import { FaSearch } from "react-icons/fa";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useRef } from 'react'

function Navbar({searchQuery,onSearchChange}) {
  const inputRef = useRef(null)
  return (
    <div className="sticky top-0 z-50 p-3 sm:p-5 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5 backdrop-blur-sm bg-black/20">

      {/* LOGO AND BRAND NAME */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-7 sm:h-9 w-auto"
        />
        <h1 className="hidden sm:block text-xl sm:text-2xl font-bold text-white font-jet">ZERO VAULT</h1>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="flex items-center gap-2 border-[#008B1E] border-2 p-1.5 sm:p-2 rounded-lg font-jet w-full max-w-[28rem] focus-within:border-white hover:border-white">

        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text" 
          placeholder="Search" 
          aria-label="Search entries"
          className="text-white bg-transparent outline-none w-full placeholder:text-gray-500 text-sm sm:text-base"
        />
        <FaSearch 
          onClick={()=>inputRef.current?.focus()}
          className="text-gray-400 cursor-pointer size-4 sm:size-[initial]"
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