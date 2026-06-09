import { useAuth } from '@clerk/clerk-react'
import { useState } from 'react'
import {deriveKey,generateSalt,encrypt,decrypt} from "../utils/crypto"
import {setupEncryption} from '../services/api'

function MasterPasswordScreen({mode,encryptionConfig,onUnlock,onSetup}) {

  const {getToken} = useAuth()
  const [password,setPassword] = useState("")
  const [confrimPassword,setConfrimPassword] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSetupSubmit = async() => {
    setError('')
    if(!password){
      setError('Password is required');
      return;
    }
    if(password !== confrimPassword){
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try{
      const salt = generateSalt();
      const key = await deriveKey(password,salt);
      const {ciphertext,iv} = await encrypt("VALID",key);
      const verificationToken = ciphertext + ":" + iv;
      const token = await getToken();
      await setupEncryption(token,{encryptionSalt : salt, verificationToken});

      onSetup(key); 
      
    }catch(err){
      console.log('error',err);
      setError(err.message);
    }finally{
      setLoading(false)
    }
  }

  const handleUnlockSubmit = async() => {
    setError('');
    if(!password){
      setError('Password is required')
      return
    } 
    setLoading(true);
    try{
      const key = await deriveKey(password,encryptionConfig.encryptionSalt);
      const [ciphertext,iv] = encryptionConfig.verificationToken.split(':');
      const result = await decrypt(ciphertext,iv,key)
      if(result === 'VALID'){
        onUnlock(key)
      }else{
        setError('Wrong Password')
      } 
    } catch {
      setError('Wrong password')
    } finally {
      setLoading(false)
    } 
  }
    

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0a0c0d]'>

      <div className='bg-[#1a1d1e] rounded-xl p-8 w-[400px]'>
        <h1 className='text-2xl font-bold text-white text-center mb-2'>ZERO VAULT</h1>
        <p className='text-gray-400 text-center mb-4'>
          {mode == 'setup' ? 'Create your master password': 'Enter your master password to Unlock'}
        </p>

        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm font-jet'>
            {error}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault()
          mode === 'setup' ? handleSetupSubmit() : handleUnlockSubmit()
        }}>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full bg-[#121414] border border-zinc-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#008B1E] mb-3'
          />

          {mode === 'setup' && (
            <input
              type="password"
              placeholder="Confirm Master Password"
              value={confrimPassword}
              onChange={(e) => setConfrimPassword(e.target.value)}
              className="w-full bg-[#121414] border border-zinc-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#008B1E] mb-3"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008B1E] text-white rounded-lg py-2.5 mt-2 hover:opacity-90 disabled:opacity-50 font-medium"
          >
            {loading ? 'Please wait...' : mode === 'setup' ? 'Create Vault' : 'Unlock Vault'}
          </button>
        </form>
        
      </div>

    </div>
  )
}

export default MasterPasswordScreen