import { useState,useEffect } from "react";

function EntryModal({isOpen,onClose,onSubmit,mode,entry}) {

  const [form, setForm] = useState({ label: '', username: '', password: '', url: '', category: 'Personal', notes: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (entry) {
      setForm({ label: entry.label, username: entry.username, password: entry.password, url: entry.url, category: entry.category || 'Personal', notes: entry.notes })
    } else {
      setForm({ label: '', username: '', password: '', url: '', category: 'Personal', notes: '' })
    }
    setErrors({})
  }, [entry])

  const handleSubmit = async () => {
    const newErrors = {}
    if (!form.label.trim()) newErrors.label = 'Label is required'
    if (!form.username.trim()) newErrors.username = 'Username is required'
    if (!form.password.trim()) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await onSubmit(form)
    onClose()
  }

  if (!isOpen) return null

  const inputClass = (field) => `bg-[#121414] border ${errors[field] ? 'border-red-500' : 'border-zinc-700'} rounded-lg px-3 py-2 text-white outline-none focus:border-[#008B1E]`

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}> 
      <div className="bg-[#1a1d1e] rounded-xl w-full sm:w-[480px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-auto" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">{mode === 'edit' ? 'Edit Entry' : 'Add Entry'}</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-gray-300 text-sm">Label / Site Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g., Github Personal" value={form.label} onChange={(e) => { setForm({ ...form, label: e.target.value }); setErrors({ ...errors, label: undefined }) }} className={inputClass('label')} aria-describedby={errors.label ? 'entry-label-error' : undefined}/>
          {errors.label && <span id="entry-label-error" className="text-red-500 text-xs">{errors.label}</span>}
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-gray-300 text-sm">Username / Email <span className="text-red-500">*</span></label>
          <input type="text" placeholder="user@example.com" value={form.username} onChange={(e) => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: undefined }) }} className={inputClass('username')} aria-describedby={errors.username ? 'entry-username-error' : undefined}/>
          {errors.username && <span id="entry-username-error" className="text-red-500 text-xs">{errors.username}</span>}
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-gray-300 text-sm">Password <span className="text-red-500">*</span></label>
          <input type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: undefined }) }} className={inputClass('password')} aria-describedby={errors.password ? 'entry-password-error' : undefined}/>
          {errors.password && <span id="entry-password-error" className="text-red-500 text-xs">{errors.password}</span>}
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-gray-300 text-sm">URL</label>
          <input type="text" placeholder="https://example.com" value={form.url} onChange={(e)=>setForm({ ...form, url: e.target.value })} className="bg-[#121414] border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#008B1E]"/>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-gray-300 text-sm">Category</label>
          <select value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })} className="bg-[#121414] border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#008B1E]">
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Finance">Finance</option>
            <option value="Developer">Developer</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-gray-300 text-sm">Notes</label>
          <input type="text" placeholder="Add notes..." value={form.notes} onChange={(e)=>setForm({ ...form, notes: e.target.value })} className="bg-[#121414] border border-zinc-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#008B1E]"/>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
          <button onClick={onClose} className="bg-transparent text-gray-400 border border-zinc-700 rounded-lg px-6 py-2.5 hover:text-white min-h-[44px]">Cancel</button>
          <button onClick={handleSubmit} className="bg-[#008B1E] text-white rounded-lg px-6 py-2.5 hover:opacity-90 min-h-[44px]">{mode === 'edit' ? 'Update Entry' : 'Save Entry'}</button>
        </div>
      </div>
    </div>
  )
}

export default EntryModal