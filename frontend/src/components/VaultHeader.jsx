import { IoFilter } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";

function VaultHeader({totalCount = 0}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 m-3 sm:m-4">
      <div className="text-white flex flex-col gap-1">
        {/* LEFT SECTION COUNT OF ENTRIES */}
        <h1 className="text-xl sm:text-2xl font-semibold">All Vaults</h1>
        <p className="text-sm sm:text-base">{totalCount} secure entries encrypted</p>
      </div>

        {/* RIGHT SECTION BUTTONS */}
        <div className="flex gap-2">
          <button className="flex items-center text-white cursor-pointer hover:text-[#008B1E] hover:border-[#008B1E] transition-all duration-200 gap-1.5 sm:gap-2 border border-gray-600 h-fit px-2.5 sm:px-3 py-1 rounded-lg text-sm sm:text-base">
            <IoFilter className="text-xl sm:text-2xl"/>
            <span className="hidden sm:inline">Filter</span>
          </button>

          <button className="flex items-center text-white cursor-pointer hover:text-[#008B1E] hover:border-[#008B1E] transition-all duration-200 gap-1.5 sm:gap-2 border border-gray-600 h-fit px-2.5 sm:px-3 py-1 rounded-lg text-sm sm:text-base">
            <MdOutlineSort className="text-xl sm:text-2xl"/>
            <span className="hidden sm:inline">Sort</span>
          </button>
        </div>

    </div>
  )
}

export default VaultHeader