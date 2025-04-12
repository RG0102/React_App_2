import React from "react";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const Bingo = () => {
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
      <h1 className="mb-4">🎉 Bingo 🎉</h1>
      
      <div className="card mb-4" style={{ width: '90%', margin: '0 auto' }}>
        <div className="card-body">
          <h5 className="card-title">What We Offer</h5>
          <p className="card-text">
            Our Bingo service provides a fun and engaging way for elderly individuals to socialize, stay active, and enjoy friendly competition. Volunteers facilitate games to promote interaction and community.
          </p>
        </div>
      </div>

      {/* Mini cards for each Bingo service */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {/* Organizing Bingo Games */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🎲 Organizing Bingo Games</h6>
            <p className="card-text">
              Arrange and facilitate regular bingo games to encourage participation and social interaction among seniors.
            </p>
          </div>
        </div>

        {/* Providing Bingo Materials */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🖊️ Providing Bingo Materials</h6>
            <p className="card-text">
              Supply bingo cards, markers, and other materials needed to play, ensuring a smooth and enjoyable game.
            </p>
          </div>
        </div>

        {/* Teaching Bingo Rules */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">📚 Teaching Bingo Rules</h6>
            <p className="card-text">
              Educate seniors about the rules and strategies of bingo to enhance their understanding and enjoyment of the game.
            </p>
          </div>
        </div>

        {/* Prize Distribution */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🏆 Prize Distribution</h6>
            <p className="card-text">
              Organize and distribute small prizes to winners, adding excitement and motivation to the games.
            </p>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/help')}>
        Back to Volunteer Services
      </button>
    </div>
  );
};

export default Bingo;
