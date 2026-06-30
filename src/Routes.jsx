import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/Admin/Login";
import Admin from "./components/Admin/Admin";



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Admin />} />


        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;