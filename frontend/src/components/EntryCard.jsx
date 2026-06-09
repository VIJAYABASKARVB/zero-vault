import { FaRegCopy } from "react-icons/fa6";
import { TiEdit } from "react-icons/ti";
import { MdDeleteOutline } from "react-icons/md";
import getPasswordStrength from '../utils/passwordStrength'
import { decrypt } from '../utils/crypto'

const CATEGORY_COLORS = {
  Work: 'bg-blue-500/20 text-blue-400',
  Personal: 'bg-green-500/20 text-green-400',
  Finance: 'bg-amber-500/20 text-amber-400',
  Developer: 'bg-purple-500/20 text-purple-400'
}

function EntryCard({ entry, onEdit, onDelete, encryptionKey }) {
  const strength = getPasswordStrength(entry.password)
  return (
    <div key={entry._id} className="w-full p-3 sm:p-4 border-[0.5px] border-zinc-700 group relative rounded-lg">

      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button aria-label="Edit entry" type="button" onClick={() => onEdit(entry._id)} className="cursor-pointer text-white p-2">
          <TiEdit className="size-5 sm:size-[initial]" />
        </button>
        <button aria-label="Delete entry" type="button" onClick={() => onDelete(entry._id)} className="cursor-pointer text-white p-2">
          <MdDeleteOutline className="size-5 sm:size-[initial]" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-bold text-xl sm:text-2xl text-white truncate">{entry.label}</h2>
        {entry.category && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${CATEGORY_COLORS[entry.category] || 'bg-gray-500/20 text-gray-400'}`}>
            {entry.category}
          </span>
        )}
      </div>

      <div className="flex justify-between mb-2 gap-2 items-center">
        <p className="font-jet text-gray-400 text-sm sm:text-base truncate">{entry.username}</p>
        <button aria-label="Copy username" type="button" onClick={() => navigator.clipboard.writeText(entry.username)} className="cursor-pointer text-gray-400 p-2">
          <FaRegCopy size={20} />
        </button>
      </div>
    
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs sm:text-sm font-medium text-white">Strength</span>
          <span className="text-xs sm:text-sm font-medium text-white">{strength.score}%</span>
        </div>
        <div className="w-full bg-[#1F1F1F] rounded-full h-1.5 sm:h-2">
          <div className={`${strength.color} h-1.5 sm:h-2 rounded-full`} style={{ width: `${strength.score}%` }}></div>
        </div>
      </div>

      <button type="button" className="flex items-center gap-2 bg-[#008B1E] px-3 sm:px-4 py-1.5 sm:py-2 w-full cursor-pointer justify-center min-h-[44px] rounded-lg" onClick={ async () => {
        const plaintext = await decrypt(entry._ciphertext,entry._iv,encryptionKey)
        navigator.clipboard.writeText(plaintext)
      }}>
        <FaRegCopy className="size-4 sm:size-[initial]" />
        <p className="font-jet text-sm sm:text-base">Copy</p>
      </button>

    </div>
  )
}

export default EntryCard;