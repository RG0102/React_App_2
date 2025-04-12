import React from "react";
import { Link } from "react-router-dom";
import "./privacyPolicy.css"; // Assuming you are using an external CSS file
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> 09/2/2025</p>

        <h2>1. Information We Collect</h2>
        <p>We may collect personal details such as your name, email, and preferences. Volunteers may require verification.</p>

        <h2>2. How We Use Your Information</h2>
        <p>Your data is used to match users, enhance security, and provide services.</p>

        <h2>3. Data Sharing & Security</h2>
        <p>We never sell your data. All personal information is securely stored and encrypted.</p>

        <h2>4. Your Rights (GDPR Compliance)</h2>
        <ul>
          <li><strong>Access Your Data:</strong> Request a copy of your data.</li>
          <li><strong>Request Data Deletion:</strong> Ask to delete your account.</li>
          <li><strong>Withdraw Consent:</strong> Opt-out of certain data processing.</li>
        </ul>

        <p>To make a request, contact us at <a href="mailto:support@elderlyconnect.com">support@elderlyconnect.com</a>.</p>

        <h2>5. Cookies & Tracking</h2>
        <p>We use cookies to enhance your experience. Manage preferences in your browser.</p>

        <h2>6. Contact Us</h2>
        <p>Email: <a href="mailto:support@elderlyconnect.com">support@elderlyconnect.com</a></p>

        <Link to="/">Go Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
