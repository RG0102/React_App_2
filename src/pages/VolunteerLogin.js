import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, firestore, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import * as Components from "./Components2";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

function Volunteer() {
  console.log("Firebase Auth instance:", auth);

  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const navigate = useNavigate();

  // Speech Synthesis function
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech Synthesis not supported in this browser.");
    }
  };

  // Delayed speech for email input
  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    if (emailInput) {
      clearTimeout(window.emailTypingTimeout);
      window.emailTypingTimeout = setTimeout(() => {
        if (!speechSynthesis.speaking) {
          speakText(`You have entered the email: ${emailInput}`);
        }
      }, 1000);
    }
  };

  // Handle Sign-In
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Fetch volunteer data from the "volunteers" collection
      const volunteerDoc = await getDoc(doc(firestore, "volunteers", user.uid));
      const volunteerData = volunteerDoc.data();

      if (volunteerData) {
        if (volunteerData.role === "volunteer") {
          navigate(parseInt(volunteerData.age, 10) > 18 ? "/VolunteerService" : "/home");
        }
      }
    } catch (error) {
      speakText(error.message);
    }
  };

  // Handle volunteer registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreeToPolicy) {
      speakText("Please accept the privacy policy before signing up.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Store volunteer data in the "volunteers" collection with role set to "volunteer"
      await setDoc(doc(firestore, "volunteers", user.uid), {
        email,
        age,
        role: "volunteer",
      });
      navigate(parseInt(age, 10) > 18 ? "/VolunteerProfile" : "/home");
    } catch (error) {
      speakText(error.message);
    }
  };

  // Toggle between Sign In and Sign Up
  const handleToggle = (signInMode) => {
    setIsSignIn(signInMode);
  };

  useEffect(() => {
    setTimeout(() => {
      if (!speechSynthesis.speaking) {
        speakText("Welcome to the Volunteer Login Page.");
      }
    }, 500);
  }, []);

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={isSignIn}>
        <Components.Form>
          <Components.Title>Create Account</Components.Title>
          <Components.Input type="text" placeholder="Name" />
          <Components.Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Components.Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <Components.Input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
          <Components.PrivacyContainer>
            <Components.Checkbox
              type="checkbox"
              checked={agreeToPolicy}
              onChange={(e) => setAgreeToPolicy(e.target.checked)}
            />
            <Components.Label>
              I accept <a href="/privacy-policy">Terms and Conditions</a>
            </Components.Label>
          </Components.PrivacyContainer>
          <Components.Button onClick={handleRegister}>Register as Volunteer</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={isSignIn}>
        <Components.Form onSubmit={handleSignIn}>
          <Components.Title>Sign in</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <Components.Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <Components.Button type="submit">Sign In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={isSignIn}>
        <Components.Overlay signinIn={isSignIn}>
          <Components.LeftOverlayPanel signinIn={isSignIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>Please login with your personal info</Components.Paragraph>
            <Components.GhostButton onClick={() => handleToggle(true)}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>
          <Components.RightOverlayPanel signinIn={isSignIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>Enter your personal details and start your journey</Components.Paragraph>
            <Components.GhostButton onClick={() => handleToggle(false)}>Sign Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default Volunteer;
