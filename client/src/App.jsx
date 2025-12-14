import { useState } from 'react'
import {BrowserRouter  as Router,Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailsPage from './pages/DetailsPage'
import Recommendation from './pages/Recommendation'
import AppliedjobPage from './pages/AppliedjobPage'
import Register from './components/Register'

function App() {

  return (
    <>
      
       <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/jobdetail/apply/:id" element={<DetailsPage/>}/>
        <Route path="/job/applied/:id" element={<AppliedjobPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/recommender" element={<Recommendation/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
  </Router>
   <ToastContainer />
    </>
  )
}

export default App
