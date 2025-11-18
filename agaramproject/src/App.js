import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Layouts/LoginPage";
import HomePage from "./components/Layouts/HomePage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";

function App() {
  return (
    <Router basename="/Agaramfrontend">
      <Routes >
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home/*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
