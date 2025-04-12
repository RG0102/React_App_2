import React from'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import VolunteerLogin from "./pages/VolunteerLogin";
import Login from "./pages/Login";
import AppointmentBooking from './pages/ManageAppointment';
import Chat from './pages/Chat';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookieConsent from './pages/CookieConsent';
import UserProfile from './pages/UserProfile';
import MatchedUsers from './pages/MatchedUsers';
import VolunteerProfile from './pages/VolunteerProfile';
import Dashboard from "./pages/Dashboard";
import Help from "./pages/Help";
import Bingo from "./pages/Bingo"; 
import TechHelp from "./pages/TechHelp"; 
import GroceryHelp from "./pages/GroceryHelp"; 
import AppointmentReminder from "./pages/AppointmentReminder"; 
import ManageAppointment from "./pages/ManageAppointment"; 
import BookAppointment from "./pages/bookappointment"; 
import GroupChat from './pages/GroupChat';
import GroupChatsList from './pages/GroupChatList';
import VolunteerService from './pages/VolunteerService';
import VolunteerChat from './pages/volunteerchat';
import UserChat from './pages/userchat';

function App() {
  return (  
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/volunteerlogin" element={<VolunteerLogin />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/appointmentbooking" element={<AppointmentBooking />} />
        <Route exact path="/chat" element={<Chat />} />
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route exact path="/cookie-consent" element={<CookieConsent />} />
        <Route exact path="/MatchedUsers"element={<MatchedUsers />} />
        <Route exact path="/user-profile"element={<UserProfile />} />
        <Route path="/VolunteerProfile" element={<VolunteerProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/tech-help" element={<TechHelp />} />
        <Route path="/grocery-help" element={<GroceryHelp />} />
        <Route path="/appointment-reminder" element={<AppointmentReminder />} />
        <Route path="/ManageAppointment" element={<ManageAppointment />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/bingo" element={<Bingo />} />
        <Route path="/GroupChat" element={<GroupChat />} />
        <Route path="/GroupChatList" element={<GroupChatsList />} />
        <Route path="/VolunteerService" element={<VolunteerService />} />
        <Route path="/VolunteerChat" element={<VolunteerChat />} />
        <Route path="/userchat" element={<UserChat />} />
        
      </Routes>
    </Router>
  );
}

export default App;



