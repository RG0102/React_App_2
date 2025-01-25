import React, { useEffect } from "react";
import { motion } from "framer-motion"; // Importing framer-motion for animation
import "../styles/HomePage.css"; // Make sure the path to your CSS is correct

function Home() {
  const images = [
    { src: require("../assets/images/image1.webp"), alt: "Image 1", description: "A serene park with lush green trees." },
    { src: require("../assets/images/image2.avif"), alt: "Image 2", description: "A group of elderly people enjoying a conversation." },
    { src: require("../assets/images/image3.jpg"), alt: "Image 3", description: "A peaceful sunset over the horizon." },
    { src: require("../assets/images/image4.png"), alt: "Image 4", description: "A cozy living room with warm lighting." },
  ];

  useEffect(() => {
    const synth = window.speechSynthesis; // Access the SpeechSynthesis API

    const welcomeMessage = new SpeechSynthesisUtterance("Welcome to Elderly Connect. Bringing smiles, one connection at a time.");
    // Speak the message once when the component is mounted
    if (synth) {
      synth.speak(welcomeMessage);
    }

    // Cleanup on component unmount (stop any ongoing speech)
    return () => {
      if (synth.speaking) {
        synth.cancel(); // Cancel any ongoing speech to prevent it from repeating
      }
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  // Function to speak image description with a delay between each
  const speakImageDescription = (imageDescription, delay) => {
    const synth = window.speechSynthesis;
    if (synth) {
      setTimeout(() => {
        const imageMessage = new SpeechSynthesisUtterance(imageDescription); // Speak the specific description of the image
        synth.speak(imageMessage);
      }, delay); // Delay speech synthesis for each image
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section with Animated Text */}
      <div className="hero">
        <motion.h1
          className="welcome-text"
          initial={{ opacity: 0, y: 50 }} // Starts invisible and below
          animate={{ opacity: 1, y: 0 }} // Fades in and slides up
          transition={{ duration: 1 }} // Duration of animation
        >
          Welcome to Elderly Connect
        </motion.h1>
      </div>

      {/* Image Grid Section */}
      <div className="image-grid">
        {images.map((image, index) => {
          const delay = index * 3000; // Delay increases for each image (3 seconds for each image)
          return (
            <motion.div
              className="image-item"
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 * index }} // Staggered fade-in
              onAnimationComplete={() => speakImageDescription(image.description, delay)} // Speak the specific image description after it fades in
            >
              <img src={image.src} alt={image.alt} />
            </motion.div>
          );
        })}
      </div>

      {/* Slogan Section */}
      <motion.p
        className="slogan"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }} // Slogan fades in after a short delay
      >
        <span className="glow-text">Bringing Smiles, One Connection at a Time</span>
      </motion.p>
    </div>
  );
}

export default Home;
