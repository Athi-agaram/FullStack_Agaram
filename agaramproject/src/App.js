import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Layouts/LoginPage";
import HomePage from "./components/Layouts/HomePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import EcommercePage from "./Pages/Ecommerce/EcommercePage";  // ⭐ ADD THIS

function App() {
  return (
    <Router basename="/AgaramfrontendCompleted">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home/*" element={<HomePage />} />

        {/* ⭐ NEW ROUTE FOR FULL-PAGE ECOMMERCE */}
        <Route path="/ecommerce" element={<EcommercePage />} />
      </Routes>
    </Router>
  );
}

export default App;
