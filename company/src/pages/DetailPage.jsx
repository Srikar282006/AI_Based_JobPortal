import React from 'react'
import Navbar from '../components/Navbar.jsx'
import DetailFrom from '../components/DetailFrom.jsx'
import Footer from '../components/Footer.jsx'

const DetailPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
        <DetailFrom />
      </main>

      <Footer />
    </div>
  )
}

export default DetailPage
