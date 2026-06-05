import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'

function App() {

  //from the ClerkProvider
  const { isSignedIn,isLoaded} = useUser();

  //To avoid the flickring Effect
  if(!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"}/>} />
        <Route path='/dashboard' element={isSignedIn ? <DashboardPage/> : <Navigate to={"/"}/>}/>
      </Routes>
    </>
  )
}

export default App