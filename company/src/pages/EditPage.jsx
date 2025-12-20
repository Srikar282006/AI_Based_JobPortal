import React from 'react'
import Navbar from '../components/Navbar'
import Editjob from '../components/Editjob'
import Footer from '../components/Footer'

const EditPage = () => {
  return (
    <>

    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
        <Editjob/>
      </main>

      <Footer />
    </div>
    </>
  )
}

export default EditPage