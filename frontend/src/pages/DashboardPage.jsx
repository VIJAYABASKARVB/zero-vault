import Navbar from '../components/Navbar'
import VaultHeader from '../components/VaultHeader'
import CategoryTabs from '../components/CategoryTabs'
import EntryGrid from '../components/EntryGrid'
import AddEntryButton from '../components/AddEntryButton'
import { useState, useMemo, useEffect } from 'react'
import EntryModal from '../components/EntryModal'
import ConfirmModal from '../components/ConfirmModal'
import MasterPasswordScreen from '../components/MasterPasswordScreen'
import { getEncryptionConfig,fetchEntries,createEntry,updateEntry,deleteEntry } from '../services/api'
import { useAuth } from '@clerk/clerk-react'
import { encrypt,decrypt } from '../utils/crypto'

function DashboardPage() {
  const { getToken } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState([])
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [appMode, setAppMode] = useState('loading')
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [encryptionConfig, setEncryptionConfig] = useState({ encryptionSalt: null, verificationToken: null })

  useEffect(() => {
    if(appMode !== 'ready') return
    const loadEntries = async()=>{
      setLoadingEntries(true)
      try{
        const token = await getToken();
        const data = await fetchEntries(token);
        const decrypted = await Promise.all(
          data.Entries.map(async entry => ({
            ...entry,
            password: await decrypt(entry.password,entry.iv,encryptionKey),
            _ciphertext: entry.password,
            _iv: entry.iv
          }))
        )
        setEntries(decrypted)
      }catch(err){
        console.error('Failed to load Entries:',err)
      }finally{
        setLoadingEntries(false)
      }
    }
    loadEntries()
  },[appMode,encryptionKey])

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
    let result = entries
    if (activeTab !== 'All') {
      result = result.filter(entry => entry.category === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(entry =>
        entry.label.toLowerCase().includes(q) ||
        entry.username.toLowerCase().includes(q)
      )
    }
    return result
  }, [entries, activeTab, searchQuery])

  const onAdd = async (formData) => {
    const token = await getToken();
    const {ciphertext,iv} = await encrypt(formData.password,encryptionKey)
    const {entry} = await createEntry(token,{...formData,password:ciphertext,iv})
    const decryptedEntry = {...entry,password:await decrypt(entry.password,entry.iv,encryptionKey), _ciphertext: entry.password, _iv: entry.iv}
    setEntries(prev => [...prev,decryptedEntry])
  }

  const onEdit = (id) => {
    const entry = entries.find(e => e._id === id)
    setEditingEntry(entry)
    setShowModal(true)
  }

  const onUpdate = async (formData) => {
    const token = await getToken();
    const {ciphertext,iv} = await encrypt(formData.password,encryptionKey)
    const {entry} = await updateEntry(token,editingEntry._id,{
      ...formData,
      password:ciphertext,
      iv
    })
    const decryptedEntry = { ...entry, password: await decrypt(entry.password, entry.iv, encryptionKey), _ciphertext: entry.password, _iv: entry.iv }
    setEntries(prev => prev.map(
      e => e._id === editingEntry._id ? decryptedEntry : e
    ))
    setEditingEntry(null)
    setShowModal(false)
  }

  const onDelete = (id) => {
    setDeleteTarget(id)
  }

  const confirmDelete = async () => {
    const token = await getToken()
    await deleteEntry(token,deleteTarget)
    setEntries(prev => prev.filter(e => e._id !== deleteTarget))
    setDeleteTarget(null)
  }

  if (appMode === 'loading') return <div className="flex items-center justify-center min-h-screen bg-[#0a0c0d] p-4"><p className="text-gray-400 text-sm sm:text-base">Loading...</p></div>
  if (appMode === 'setup') return <MasterPasswordScreen mode="setup" onSetup={handleSetup} />
  if (appMode === 'unlock') return <MasterPasswordScreen mode="unlock" encryptionConfig={encryptionConfig} onUnlock={handleUnlock} />

  if (loadingEntries){
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#0a0c0d] p-4'>
        <p className='text-gray-400 text-base sm:text-lg'>Loading your Vault...</p>
      </div>
    )
  }

  return (
    <div>

      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <VaultHeader totalCount={entries.length} />

      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <EntryGrid 
        entries={filteredEntries} 
        onDelete={onDelete} 
        onEdit={onEdit} 
        searchQuery={searchQuery} 
        encryptionKey={encryptionKey}
      />

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