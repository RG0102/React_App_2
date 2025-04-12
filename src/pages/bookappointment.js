import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Updated import to include auth
import { collection, addDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    service: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine date and time into a single timestamp
      const dateTime = new Date(`${appointment.date}T${appointment.time}`);
      
      // Get the current user's UID
      const user = auth.currentUser;
      if (!user) {
        setMessage("You must be logged in to book an appointment.");
        return;
      }

      // Add the appointment with the userId attached
      await addDoc(collection(db, "appointments"), {
        ...appointment,
        timestamp: dateTime,
        userId: user.uid,  // Attaching the current user's UID
      });
      
      setMessage("Appointment booked successfully!");
      setAppointment({ name: "", date: "", time: "", location: "", service: "" });
      setTimeout(() => navigate("/ManageAppointment"), 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setMessage("Error booking appointment. Please try again.");
    }
  };

  const handleCommand = (command) => {
    console.log("Command received:", command);
    if (command.includes("back") || command.includes("go back")) {
      navigate("/help");
    }
    else if (command.includes("book") || command.includes("appointment")) {
      navigate("/bookappointment");
    } else if (command.includes("view") || command.includes("appointments") ||command.includes("manage appointments")) {
      navigate("/manageappointment");
    } else if (command.includes("home") || command.includes("dashboard")) {
      navigate("/dashboard");
    } else {
      console.log("No matching navigation command.");
    }
  };
  useSpeechRecognition(handleCommand);

  return (
    <div className="container mt-5">
      <h1 className="text-center">📅 Book an Appointment 📅</h1>
      {message && (
        <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={appointment.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" name="date" value={appointment.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Time</label>
          <input type="time" className="form-control" name="time" value={appointment.time} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" className="form-control" name="location" value={appointment.location} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Service</label>
          <select className="form-control" name="service" value={appointment.service} onChange={handleChange} required>
            <option value="">Select Service</option>
            <option value="TechHelp">Tech Help</option>
            <option value="GroceryHelp">Grocery Help</option>
            <option value="AppointmentReminder">Appointment Reminder</option>
            <option value="Bingo">Bingo</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Book Appointment
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/manageappointment")}>
          View Appointments
        </button>
      </form>
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/help")}>
        Back to Volunteer Services
      </button>
    </div>
  );
};

export default BookAppointment;
