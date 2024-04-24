import React, { useState, useEffect } from "react";
import Editor from "./components/Editor";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ViewDocument from "./components/ViewDocument";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen gradient-text bg-gradient-to-r from-blue-400  to-blue-100">
      <ToastContainer autoClose={3000} style={{ zIndex: 9999 }} />{" "}
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view-documents" element={<ViewDocument />} />
      </Routes>
    </div>
  );
}

export default App;
