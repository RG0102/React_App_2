import React, { useEffect } from "react";
import { motion } from "framer-motion"; // For animations
import "../styles/HomePage.css"; // Ensure the CSS path is correct
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
import image1 from "../assets/images/image1.webp";
import image2 from "../assets/images/image2.avif";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const images = [
    { src: image1, alt: "Image 1" },
    { src: image2, alt: "Image 2" },
    { src: image3, alt: "Image 3" },
    { src: image4, alt: "Image 4" },
  ];

    const navigate = useNavigate();


      // Define how to handle commands
    const handleCommand = (command) => {
      console.log("Command received:", command);
      if (command.includes("user") || command.includes("user login")|| command.includes("login")) {
        navigate("/login");
      } else if (command.includes("volunteer")) {
        navigate("/volunteerlogin");
      } else {
        console.log("No matching navigation command.");
      }
    };
    
    // Use the custom hook
    useSpeechRecognition(handleCommand);


  // Standardized Speech Synthesis function
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech Synthesis not supported in this browser.");
    }
  };

  useEffect(() => {
    const synth = window.speechSynthesis;
    const welcomeText =
      "Welcome to Elderly Connect. Bringing smiles, one connection at a time.";

    // Wait until voices are loaded before speaking
    const speakAfterVoicesLoad = () => {
      if (synth.getVoices().length > 0) {
        speakText(welcomeText);
      } else {
        setTimeout(speakAfterVoicesLoad, 100);
      }
    };

    speakAfterVoicesLoad();

    return () => {
      if (synth.speaking) synth.cancel();
    };
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section with Animated Text */}
      <div className="hero">
        <motion.h1
          className="welcome-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Elderly Connect
        </motion.h1>
      </div>

      {/* Image Grid Section */}
      <div className="image-grid">
        {images.map((image, index) => (
          <motion.div
            className="image-item"
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 * index }}
          >
            <img src={image.src} alt={image.alt} />
          </motion.div>
        ))}
      </div>

      {/* Slogan Section */}
      <motion.p
        className="slogan"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <span className="glow-text">
          Bringing Smiles, One Connection at a Time
        </span>
      </motion.p>
    </div>
  );
}

export default Home;



