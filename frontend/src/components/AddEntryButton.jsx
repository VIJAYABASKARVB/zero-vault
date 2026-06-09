import { IoMdAdd } from "react-icons/io";

function AddEntryButton({onClick}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#008B1E] text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-2xl transition-all duration-200" onClick={onClick}>
      <IoMdAdd size={28} />
    </div>
  )
}

export default AddEntryButton