import React, { useState, useEffect } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";


const CookieConsent = () => {
  const [consent, setConsent] = useState(localStorage.getItem("cookieConsent"));

  useEffect(() => {
    if (!consent) {
      document.getElementById("cookie-banner").style.display = "block";
    }
  }, [consent]);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setConsent("true");
    document.getElementById("cookie-banner").style.display = "none";
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setConsent("false");
    document.getElementById("cookie-banner").style.display = "none";
  };

  return (
    <div id="cookie-banner" className="cookie-banner">
      <p>We use cookies to improve your experience. By continuing, you agree to our Privacy Policy.</p>
      <button onClick={acceptCookies} className="btn btn-success">Accept</button>
      <button onClick={rejectCookies} className="btn btn-danger">Reject</button>
    </div>
  );
};

export default CookieConsent;
