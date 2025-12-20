import React from 'react'
import Navbar from '../components/Navbar'
import Profile from '../components/Profile'
import Footer from '../components/Footer.jsx'

const ProfilePage = () => {
  return (
    <>

    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
       <Profile/>
      </main>

      <Footer />
    </div>
    </>
  )
}

export default ProfilePage