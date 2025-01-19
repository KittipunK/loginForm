import React, {useEffect, useState} from 'react'
import SignInForm from './Components/SignInForm.tsx'
import SignUpForm from './Components/SignUpForm.tsx'
import SuccessPage from './Components/SuccessPage.tsx'
import ForgotPasswordForm from './Components/ForgotPasswordForm.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'

function App() {

  return (
    <div className="main">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignInForm/>}/>
          <Route path='/signup' element={<SignUpForm/>}/>
          <Route path='/success' element={<SuccessPage/>}/>
          <Route path='/forgotPassword' element={<ForgotPasswordForm/>}/>
        </Routes>
      </BrowserRouter>
      
    </div> 
  );
}

export default App;


