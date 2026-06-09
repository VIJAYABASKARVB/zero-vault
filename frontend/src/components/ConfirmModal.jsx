function ConfirmModal({ isOpen, onClose, onConfirm, label }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[#1a1d1e] rounded-xl w-[400px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Delete Entry</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">&quot;{label}&quot;</span>?
        </p>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="bg-transparent text-gray-400 border border-zinc-700 rounded-lg px-6 py-2 hover:text-white">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className="bg-red-600 text-white rounded-lg px-6 py-2 hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
