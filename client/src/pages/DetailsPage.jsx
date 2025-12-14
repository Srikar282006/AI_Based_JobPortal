import React from "react";
import Navbar from "../components/Navbar";
import CompanyDetail from "../components/CompanyDetail";

const DetailsPage = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <CompanyDetail/>
      </div>
    </>
  );
};

export default DetailsPage;
