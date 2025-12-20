import React from 'react'
import Jobspost from '../components/Jobspost'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer.jsx'

const JobsPage = () => {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
        <Jobspost/>
      </main>

      <Footer />
    </div>
    </>
  )
}

export default JobsPage