import { FaRegCopy } from "react-icons/fa6";
import { TiEdit } from "react-icons/ti";
import { MdDeleteOutline } from "react-icons/md";
import getPasswordStrength from '../utils/passwordStrength'

function EntryCard({ entry, onCopy, onEdit, onDelete }) {
  const strength = getPasswordStrength(entry.password)
  return (
    <div key={entry._id} className="w-full p-4 border-[0.5px] border-zinc-700 group relative rounded-lg">

      <div className="absolute top-4 right-4 hidden group-hover:flex gap-2">
        <TiEdit className="cursor-pointer text-white" onClick={()=>onEdit(entry._id)} />
        <MdDeleteOutline className="cursor-pointer text-white"onClick={()=>onDelete(entry._id)}  />
      </div>

      <h2 className="font-bold text-2xl text-white">{entry.label}</h2>

      <div className="flex justify-between mb-2">
        <p className="font-jet text-gray-400">{entry.username}</p>
        <FaRegCopy size={20} color="gray" className="cursor-pointer" onClick={()=>navigator.clipboard.writeText(entry.username)} />
      </div>
    
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-white">Strength</span>
          <span className="text-sm font-medium text-white">{strength.score}%</span>
        </div>
        <div className="w-full bg-[#1F1F1F] rounded-full h-2">
          <div className={`${strength.color} h-2 rounded-full`} style={{ width: `${strength.score}%` }}></div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#008B1E] px-4 py-2 w-full cursor-pointer justify-center " onClick={() => onCopy(entry.password)}>
        <FaRegCopy />
        <p className="font-jet">Copy</p>
      </div>

    </div>
  )
}

export default EntryCard;