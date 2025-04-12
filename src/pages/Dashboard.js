import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Import both auth and db from firebase
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import "../styles/Dashboard.css";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const Dashboard = () => {
  const navigate = useNavigate();

  // Check authentication AND verify that a "user" document exists.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Not logged in at all – redirect to login.
        navigate("/login");
      } else {
        // Check if the user exists in the "users" collection
        const checkUserRole = async () => {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
              // User document not found, so either a volunteer or incomplete user profile.
              navigate("/login");
            }
          } catch (error) {
            console.error("Error checking user role:", error);
            navigate("/login");
          }
        };

        checkUserRole();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle voice commands for navigation.
  const handleCommand = (command) => {
    console.log("Command received:", command);
    if (command.includes("dashboard")) {
      navigate("/dashboard");
    } else if (command.includes("help")) {
      navigate("/help");
    } else if (
      command.includes("match") ||
      command.includes("matched user") ||
      command.includes("user") ||
      command.includes("matched") ||
      command.includes("users") ||
      command.includes("matched users")
    ) {
      navigate("/MatchedUsers");
    } else if (
      command.includes("group") ||
      command.includes("group chat") ||
      command.includes("chat") ||
      command.includes("groupchat") ||
      command.includes("grouped chat")
    ) {
      navigate("/GroupChatList");
    } else {
      console.log("No matching navigation command.");
    }
  };

  // Start the speech recognition hook.
  useSpeechRecognition(handleCommand);

  const handleMatchedUsers = () => {
    navigate("/MatchedUsers");
  };

  const handleHelp = () => {
    navigate("/help");
  };

  const handleGC = () => {
    navigate("/GroupChatList");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome Back!</h1>
      <div className="dashboard-button-container">
        <button className="dashboard-button" onClick={handleMatchedUsers}>
          Matched Users
        </button>
        <button className="dashboard-button" onClick={handleHelp}>
          Help
        </button>
        <button className="dashboard-button" onClick={handleGC}>
          Group Chat
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
