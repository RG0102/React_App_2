import React from "react";
import { useNavigate } from "react-router-dom";
import googleMeetLogo from '../assets/images/google-meet-logo.svg'; 
import zoomLogo from '../assets/images/zoom-logo.png'; 
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const TechHelp = () => {
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
      <h1 className="mb-4">💻 Tech Help 💻</h1>
      
      <div className="card mb-4" style={{ width: '90%', margin: '0 auto' }}>
        <div className="card-body">
          <h5 className="card-title">What We Offer</h5>
          <p className="card-text">
            Our Tech Help service empowers elderly individuals to navigate the digital world with confidence. Volunteers provide assistance with a range of technical issues to enhance connectivity and independence.
          </p>
        </div>
      </div>

      {/* Mini cards for each service */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {/* Setting Up Devices */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">📱 Setting Up Devices</h6>
            <p className="card-text">
              Assist with the setup and configuration of phones, tablets, and computers to ensure ease of use.
            </p>
          </div>
        </div>

        {/* Teaching Social Media */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">👥 Teaching Social Media</h6>
            <p className="card-text">
              Educate seniors on how to use social media platforms to stay connected with family and friends.
            </p>
          </div>
        </div>

        {/* Assisting Online Shopping */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🛒 Assisting Online Shopping</h6>
            <p className="card-text">
              Guide seniors in safe online shopping practices and navigating websites for convenience.
            </p>
          </div>
        </div>

        {/* Support for Software Issues */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🔧 Support for Software Issues</h6>
            <p className="card-text">
              Provide troubleshooting assistance for software problems to ensure smooth operation of devices.
            </p>
          </div>
        </div>
      </div>

      {/* Meeting links section */}
      <div className="mt-4">
        <h5>Join a Meeting:</h5>
        <a href="https://meet.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Join Google Meet">
          <img src={googleMeetLogo} alt="Google Meet" style={{ width: '40px', margin: '0 10px' }} />
        </a>
        <a href="https://zoom.us/" target="_blank" rel="noopener noreferrer" aria-label="Join Zoom">
          <img src={zoomLogo} alt="Zoom" style={{ width: '40px', margin: '0 10px' }} />
        </a>
      </div>

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/help')}>
        Back to Volunteer Services
      </button>
    </div>
  );
};

export default TechHelp;
