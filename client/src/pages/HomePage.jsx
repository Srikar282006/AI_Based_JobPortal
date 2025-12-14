import React from "react";
import Navbar from "../components/Navbar";
import HomeHero from "../components/HomeHero";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <HomeHero/>
      </div>
    </>
  );
};

export default HomePage;
