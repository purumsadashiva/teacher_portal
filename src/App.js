import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import TablePage from "./components/StudentsPage/TablePage";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";


function App() {

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/students" element={<TablePage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
