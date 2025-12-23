import React from "react";
import Navbar from "../components/Navbar";
import HomeHero from "../components/HomeHero";
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <HomeHero/>
      </div>
      <Footer/>
    </>
  );
};

export default HomePage;
