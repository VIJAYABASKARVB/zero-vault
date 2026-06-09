import Navbar from '../components/Navbar'
import VaultHeader from '../components/VaultHeader'
import CategoryTabs from '../components/CategoryTabs'
import EntryGrid from '../components/EntryGrid'
import AddEntryButton from '../components/AddEntryButton'
import { useState, useMemo, useEffect } from 'react'
import EntryModal from '../components/EntryModal'
import ConfirmModal from '../components/ConfirmModal'
import MasterPasswordScreen from '../components/MasterPasswordScreen'
import { getEncryptionConfig } from '../services/api'
import dummyEntries from '../data/dummyEntries'
import { useAuth } from '@clerk/clerk-react'

function DashboardPage() {
  const { getToken } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState(dummyEntries)
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [appMode, setAppMode] = useState('loading')
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [encryptionConfig, setEncryptionConfig] = useState({ encryptionSalt: null, verificationToken: null })

  useEffect(() => {
    const init = async () => {
      const token = await getToken()
      const config = await getEncryptionConfig(token)
      setEncryptionConfig(config)
      setAppMode(config.encryptionSalt ? 'unlock' : 'setup')
    }
    init()
  }, [])

  const handleSetup = (key) => {
    setEncryptionKey(key)
    setAppMode('ready')
  }

  const handleUnlock = (key) => {
    setEncryptionKey(key)
    setAppMode('ready')
  }

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(entry =>
      entry.label.toLowerCase().includes(q) ||
      entry.username.toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  const onAdd = (formData) => {
    const newEntry = { _id: Date.now().toString(), ...formData }
    setEntries(prev => [...prev, newEntry])
  }

  const onEdit = (id) => {
    const entry = entries.find(e => e._id === id)
    setEditingEntry(entry)
    setShowModal(true)
  }

  const onUpdate = (formData) => {
    setEntries(prev => prev.map(
      e => e._id === editingEntry._id ? { ...e, ...formData } : e
    ))
    setEditingEntry(null)
    setShowModal(false)
  }

  const onDelete = (id) => {
    setDeleteTarget(id)
  }

  const confirmDelete = () => {
    setEntries(prev => prev.filter(e => e._id !== deleteTarget))
    setDeleteTarget(null)
  }

  if (appMode === 'loading') return <div className="flex items-center justify-center min-h-screen bg-[#0a0c0d]"><p className="text-gray-400">Loading...</p></div>
  if (appMode === 'setup') return <MasterPasswordScreen mode="setup" onSetup={handleSetup} />
  if (appMode === 'unlock') return <MasterPasswordScreen mode="unlock" encryptionConfig={encryptionConfig} onUnlock={handleUnlock} />

  return (
    <div>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <VaultHeader totalCount={entries.length} />
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <EntryGrid entries={filteredEntries} onDelete={onDelete} onEdit={onEdit} searchQuery={searchQuery} />
      <AddEntryButton onClick={() => setShowModal(true)} />
      <EntryModal
        key={editingEntry?._id ?? 'add'}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingEntry(null) }}
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