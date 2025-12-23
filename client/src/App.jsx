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
import ProtectedRoute from './components/ProtectedRoute'
function App() {

  return (
    <>
      
       <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/jobdetail/apply/:id" element={<ProtectedRoute><DetailsPage/></ProtectedRoute>}/>
        <Route path="/job/applied/:id" element={<ProtectedRoute><AppliedjobPage/></ProtectedRoute>}/>
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage/></ProtectedRoute> }/>
        <Route path="/recommender" element={<ProtectedRoute><Recommendation/></ProtectedRoute> }/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
  </Router>
   <ToastContainer />
    </>
  )
}

export default App
