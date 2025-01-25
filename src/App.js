import React from'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import User from "./pages/User";
import VolunteerLogin from "./pages/VolunteerLogin";
import Login from "./pages/Login";
import Footer  from "./pages/Footer";
import AppointmentBooking from './pages/AppointmentBooking';
import Chat from './pages/Chat';


function App() {
  return (  
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/user" element={<User />} /> 
        <Route exact path="/volunteerlogin" element={<VolunteerLogin />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/appointmentbooking" element={<AppointmentBooking />} />
        <Route exact path="/chat" element={<Chat />} />
      </Routes>
    <Footer />
    </Router>
  );
}

export default App;



