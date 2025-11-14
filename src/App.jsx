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
        <Route path="/Signuppage" element={<Signuppage/>}></Route>
        <Route path= "" element={<Signinpage/>}></Route>
        <Route path= "/Signinpage" element={<Signinpage/>}></Route>
        <Route path="/Dashboard" element={<Dashboard/>}></Route>
        <Route path="/Samplepage" element={<Samplepage/>}></Route>
        <Route path="/PasswordAssistance" element={<PasswordAssistance/>}></Route>
        <Route path="/CreateNewPassword" element={<CreateNewPassword/>}></Route>
        <Route path="/HomePage" element={<HomePage/>}></Route>
        
        </Routes>

      </BrowserRouter>
      
  )

}

export default App