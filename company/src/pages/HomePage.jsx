import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Herohome from '../components/Herohome.jsx'
import Footer from '../components/Footer.jsx'

const HomePage = () => {
  return (
    <>
     <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
        <Herohome/>
      </main>

      <Footer />
    </div>
    </>
  )
}

export default HomePage