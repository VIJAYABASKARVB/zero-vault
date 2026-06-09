import Navbar from '../components/Navbar'
import VaultHeader from '../components/VaultHeader'
import CategoryTabs from '../components/CategoryTabs'
import EntryGrid from '../components/EntryGrid'
import AddEntryButton from '../components/AddEntryButton'
import dummyEntries from '../data/dummyEntries'
import { useState,useMemo } from 'react'
import EntryModal from '../components/EntryModal'
import ConfirmModal from '../components/ConfirmModal'

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery,setSearchQuery] = useState('')
  const [entries, setEntries] = useState(dummyEntries)
  const [showModal,setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredEntries = useMemo(()=>{
    if(!searchQuery.trim()){
      return entries;
    }
    const q = searchQuery.toLowerCase()
    return entries.filter(entry => 
      entry.label.toLowerCase().includes(q) || 
      entry.username.toLowerCase().includes(q)
    )
  },[entries,searchQuery])

  // ADD LOGIC
  const onAdd = (formData) => {
    const newEntry = { _id: Date.now().toString(), ...formData }
    setEntries(prev => [...prev, newEntry])
  }

  //EDIT LOGIC
  const onEdit = (id) => {
    const entry = entries.find(e => e._id === id)
    setEditingEntry(entry)
    setShowModal(true)
  }

  //MODAL UPDATION LOGIC
  const onUpdate = (formData) => {
    setEntries(prev => prev.map(
      e => e._id === editingEntry._id ? { ...e, ...formData } : e
    ))
    setEditingEntry(null)
    setShowModal(false)
  }

  // DELETE LOGIC
  const onDelete = (id) => {
    setDeleteTarget(id)
  }

  const confirmDelete = () => {
    setEntries(prev => prev.filter(e => e._id !== deleteTarget))
    setDeleteTarget(null)
  }

  return (
    <div>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery}/>
      <VaultHeader totalCount={entries.length}/>
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <EntryGrid entries={filteredEntries} onDelete={onDelete} onEdit={onEdit} searchQuery={searchQuery}/>
      <AddEntryButton onClick={() => setShowModal(true)} />
      <EntryModal
        key={editingEntry?._id ?? 'add'}
        isOpen={showModal}
        onClose={()=>{
          setShowModal(false)
          setEditingEntry(null)
        }}
        onSubmit={editingEntry ? onUpdate : onAdd}
        mode={editingEntry ? 'edit' : 'add'}
        entry={editingEntry}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        label={entries.find(e => e._id === deleteTarget)?.label}
      />
    </div>
  )
}

export default DashboardPage