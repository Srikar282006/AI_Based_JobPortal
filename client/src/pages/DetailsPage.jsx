import React from "react";
import Navbar from "../components/Navbar";
import CompanyDetail from "../components/CompanyDetail";
import Footer from '../components/Footer'
const DetailsPage = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <CompanyDetail/>
      </div>
      <Footer/>
    </>
  );
};

export default DetailsPage;
