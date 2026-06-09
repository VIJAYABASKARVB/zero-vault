import { IoFilter } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";

function VaultHeader({totalCount = 0}) {
  return (
    <div className="flex justify-between m-4">
      <div className="text-white  flex flex-col gap-1">
        {/* LEFT SECTION COUNT OF ENTRIES */}
        <h1 className="text-2xl font-semibold">All Vaults</h1>
        <p>{totalCount} secure entries encrypted</p>
      </div>

        {/* RIGHT SECTION BUTTONS */}
        <div className="flex gap-2">
          <button className="flex items-center text-white cursor-pointer hover:text-[#008B1E] hover:border-[#008B1E] transition-all duration-200 gap-2 border border-gray-600 h-fit px-3 py-1 rounded-lg">
            <IoFilter className="text-2xl "/>
            <span>Filter</span>
          </button>

          <button className="flex items-center text-white cursor-pointer hover:text-[#008B1E] hover:border-[#008B1E] transition-all duration-200 gap-2 border border-gray-600 h-fit px-3 py-1 rounded-lg">
            <MdOutlineSort className="text-2xl "/>
            <span>Sort</span>
          </button>
        </div>

    </div>
  )
}

export default VaultHeader