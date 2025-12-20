import React from 'react'
import Navbar from '../components/Navbar'
import Recommender from '../components/Recommender'
import Footer from '../components/Footer'

const RecommemderPage = () => {
  return (
   <>
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
       <Recommender/>
      </main>

      <Footer />
    </div>
   </>
  )
}

export default RecommemderPage