import React from 'react'
import Appliedjob from '../components/Appliedjob'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AppliedjobPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-20 px-4">
        <Appliedjob />
      </main>

      <Footer />
    </div>
  )
}

export default AppliedjobPage
