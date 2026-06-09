function ConfirmModal({ isOpen, onClose, onConfirm, label }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-[#1a1d1e] rounded-xl w-full sm:w-[400px] p-4 sm:p-6 mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Delete Entry</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">&quot;{label}&quot;</span>?
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <button onClick={onClose} className="bg-transparent text-gray-400 border border-zinc-700 rounded-lg px-6 py-2.5 hover:text-white min-h-[44px]">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className="bg-red-600 text-white rounded-lg px-6 py-2.5 hover:bg-red-700 min-h-[44px]">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
