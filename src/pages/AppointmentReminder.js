import React from "react";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const AppointmentReminder = () => {
  const navigate = useNavigate();


      // Define how to handle commands
    const handleCommand = (command) => {
      console.log("Command received:", command);
      if (command.includes("back") || command.includes("go back")) {
        navigate("/help");
      } else {
        console.log("No matching navigation command.");
      }
    };
    
    // Use the custom hook
    useSpeechRecognition(handleCommand);
    

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">⏰ Appointment Reminder ⏰</h1>
      
      <div className="card mb-4" style={{ width: '90%', margin: '0 auto' }}>
        <div className="card-body">
          <h5 className="card-title">What We Offer</h5>
          <p className="card-text">
            Our Appointment Reminder service assists elderly individuals in managing their schedules by sending timely reminders for upcoming appointments. This helps ensure they don't miss important healthcare visits and social events.
          </p>
        </div>
      </div>

      {/* Mini cards for each Appointment Reminder service */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {/* Setting Up Appointment Reminders */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">📅 Setting Up Reminders</h6>
            <p className="card-text">
              Help individuals set up reminders for their appointments via phone calls, texts, or emails.
            </p>
          </div>
        </div>

        {/* Providing Calendar Assistance */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🗓️ Providing Calendar Assistance</h6>
            <p className="card-text">
              Assist in organizing their appointments in an easy-to-read calendar format.
            </p>
          </div>
        </div>
      </div>

      {/* Button to Book an Appointment */}
      <button className="btn btn-primary mt-4" onClick={() => navigate('/manageappointment')}>
        Manage Appointments
      </button>

      {/* Gap between buttons */}
      <div className="mt-3"></div>

      <button className="btn btn-secondary" onClick={() => navigate('/help')}>
        Back to Volunteer Services
      </button>
    </div>
  );
};

export default AppointmentReminder;
