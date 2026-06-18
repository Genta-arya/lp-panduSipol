import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Layout from "./Layout";
import MainSection from "./MainSection";
import Footer from "./Footer";

const Container = () => {
  return (
    <>
      <Navbar />

      <Header />
      <Layout>
        <MainSection />
      </Layout>
      <Footer />
    </>
  );
};

export default Container;
