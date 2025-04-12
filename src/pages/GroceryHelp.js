import React from "react";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const GroceryHelp = () => {

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
      <h1 className="mb-4">🥦 Grocery Help 🥦</h1>
      
      <div className="card mb-4" style={{ width: '90%', margin: '0 auto' }}>
        <div className="card-body">
          <h5 className="card-title">What We Offer</h5>
          <p className="card-text">
            Our Grocery Help service provides essential assistance to elderly individuals in managing their grocery shopping. Volunteers ensure that seniors have access to the food they need, promoting both health and independence.
          </p>
        </div>
      </div>

      {/* Mini cards for each service */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {/* Grocery Shopping Assistance */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🛍️ Grocery Shopping Assistance</h6>
            <p className="card-text">
              Accompany seniors during grocery shopping trips or shop on their behalf to ensure they get the necessary items.
            </p>
          </div>
        </div>

        {/* Providing Shopping Lists */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">📝 Providing Shopping Lists</h6>
            <p className="card-text">
              Help seniors create detailed shopping lists to streamline their grocery trips and ensure they don’t forget essential items.
            </p>
          </div>
        </div>

        {/* Delivery Services */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">🚚 Delivery Services</h6>
            <p className="card-text">
              Deliver groceries directly to seniors' homes, ensuring they receive their items conveniently and safely.
            </p>
          </div>
        </div>

        {/* Budgeting Assistance */}
        <div className="card m-2" style={{ width: '220px' }}>
          <div className="card-body text-left">
            <h6 className="card-title">💰 Budgeting Assistance</h6>
            <p className="card-text">
              Provide guidance on budgeting for groceries, helping seniors manage their finances while shopping.
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

export default GroceryHelp;