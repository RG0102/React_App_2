import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const Help = () => {
  const navigate = useNavigate(); // Hook for navigation

    // Define how to handle commands
  const handleCommand = (command) => {
    console.log("Command received:", command);
    if (command.includes("back") || command.includes("go back")) {
      navigate("/dashboard");
    } else if (command.includes("tech")||command.includes("tech help")||command.includes("help")) {
      navigate("/tech-help");
    } else if (command.includes("grocery")||command.includes("food")||command.includes("stuff")||command.includes("grocery help")) {
      navigate("/grocery-help");
    } else if (command.includes("appointment")||command.includes("reminder")||command.includes("remind")||command.includes("appoint")) {
      navigate("/appointment-reminder");
    } else if (command.includes("bingo")||command.includes("bin")||command.includes("go")||command.includes("games")) {
      navigate("/bingo");
    } else if (command.includes("volunteer")||command.includes("chat")||command.includes("volunteer chat")||command.includes("volunteer chats")) {
      navigate("/userchat");
    } else {
      console.log("No matching navigation command.");
    }
  };
  
  // Use the custom hook
  useSpeechRecognition(handleCommand);

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">🌟 Services 🌟</h1>
      <p className="mb-4">Choose a service to help out with:</p>

      <div className="row justify-content-center">
        {/* Tech Help Card */}
        <div className="col-md-3 mb-4"> {/* Added mb-4 for gap */}
          <div className="card" style={{ height: '200px' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">💻 Tech Help 💻</h5>
              <p className="card-text">Provide assistance with technology-related issues.</p>
              <button className="btn btn-primary" onClick={() => navigate('/tech-help')}>
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Grocery Help Card */}
        <div className="col-md-3 mb-4"> {/* Added mb-4 for gap */}
          <div className="card" style={{ height: '200px' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">🥦 Grocery Help 🥦</h5>
              <p className="card-text">Help deliver groceries to those in need.</p>
              <button className="btn btn-primary" onClick={() => navigate('/grocery-help')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        {/* Appointment Reminder Card */}
        <div className="col-md-3 mb-4"> {/* Added mb-4 for gap */}
          <div className="card" style={{ height: '200px' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">⏰ Appointment Reminder </h5>
              <p className="card-text">Remind users about their upcoming appointments.</p>
              <button className="btn btn-primary" onClick={() => navigate('/appointment-reminder')}>
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Bingo Card */}
        <div className="col-md-3 mb-4"> {/* Added mb-4 for gap */}
          <div className="card" style={{ height: '200px' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">🎉 Bingo 🎉</h5>
              <p className="card-text">Organize fun bingo games for the community.</p>
              <button className="btn btn-primary" onClick={() => navigate('/bingo')}>
                Get Started
              </button>

            </div>
          </div>
        </div>


                        {/* Bingo Card */}
                        <div className="col-md-3 mb-4"> {/* Added mb-4 for gap */}
          <div className="card" style={{ height: '200px' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="card-title">💭 Chat with Volunteer 💭</h5>
              <p className="card-text">You can talk with volunteers here when you have made an appointment.</p>
              <button className="btn btn-primary" onClick={() => navigate('/userchat')}>
                Get Started
              </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Help;
