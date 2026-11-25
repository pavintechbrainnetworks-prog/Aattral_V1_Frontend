 import React from 'react'
import Signuppage from '../src/components/signuppage/Signuppage'
import Signinpage from '../src/components/signinpage/Signinpage'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Dashboard from '../src/components/role/dashboard/Dashboard'
import Samplepage from '../src/components/role/foruser/Samplepage'
import PasswordAssistance from '../src/components/password/PasswordAssistance'
import CreateNewPassword from '../src/components/password/CreateNewPassword'
import HomePage from './components/homepage/HomePage'

function App() {
  return ( 
    
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signinpage/>} />
        <Route path="/sign-in" element={<Signinpage/>} />
        <Route path="/sign-up" element={<Signuppage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/sample" element={<Samplepage/>} />
        <Route path="/password-assistance" element={<PasswordAssistance/>} />
        <Route path="/create-new-password" element={<CreateNewPassword/>} />
        <Route path="/home" element={<HomePage/>} />
        </Routes>

      </BrowserRouter>
      
  )

}

export default App