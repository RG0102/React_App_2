import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, setDoc } from "firebase/firestore";
import {
  auth,
  firestore,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../firebase";
import * as Components from "./Components";

function App() {
  console.log("Firebase Auth instance:", auth);

  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const navigate = useNavigate();
  const commandCooldown = useRef(false);

  // Refs to always have the latest email and password values
  const emailRef = useRef("");
  const passwordRef = useRef("");

  // Update refs whenever state changes
  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

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

  // Login logic using latest email and password from refs
  const loginUser = async () => {
    console.log("Attempting login with:", {
      email: emailRef.current,
      password: passwordRef.current,
    });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailRef.current,
        passwordRef.current
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      const userData = userDoc.data();

      if (userData) {
        if (userData.role === "user") {
          navigate(parseInt(userData.age, 10) > 50 ? "/Dashboard" : "/home");
        } else if (userData.role === "volunteer") {
          navigate(parseInt(userData.age, 10) > 20 ? "/volunteer-services" : "/home");
        }
      }
    } catch (error) {
      speechSynthesis.cancel();
      speakText(error.message);
      console.error("Login error:", error);
    }
  };

  // Handle Sign-In from form submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    loginUser();
  };

  // Speech Recognition function with a 3-second command cooldown and using refs
  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      if (result.isFinal) {
        const transcript = result[0].transcript;
        console.log("You said:", transcript);
        const lowerTranscript = transcript.toLowerCase();

        if (
          !commandCooldown.current &&
          (lowerTranscript.includes("login") ||
            lowerTranscript.includes("sign in"))
        ) {
          // Use refs to check the current values
          if (!emailRef.current || !passwordRef.current) {
            speechSynthesis.cancel();
            speakText("Please enter your email and password before logging in.");
          } else {
            console.log("Triggering login action...");
            commandCooldown.current = true;
            loginUser();
            setTimeout(() => {
              commandCooldown.current = false;
            }, 2000);
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Error during recognition:", event.error);
    };

    recognition.start();
  };

  // Delayed speech for email input
  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    // No need to update emailRef here; useEffect will do it.
    if (emailInput) {
      clearTimeout(window.emailTypingTimeout);
      window.emailTypingTimeout = setTimeout(() => {
        if (!speechSynthesis.speaking) {
          speechSynthesis.cancel();
          speakText(`You have entered the email: ${emailInput}`);
        }
      }, 1000);
    }
  };

  // Update password and its ref in one handler
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    // useEffect will update passwordRef
  };

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreeToPolicy) {
      speechSynthesis.cancel();
      speakText("Please accept the privacy policy before signing up.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRef.current,
        passwordRef.current
      );
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), {
        email: emailRef.current,
        age,
        role: "user",
      });
      navigate(parseInt(age, 10) > 40 ? "/user-profile" : "/home");
      speechSynthesis.cancel();
    } catch (error) {
      speechSynthesis.cancel();
      speakText(error.message);
    }
  };

  // Toggle between Sign In and Sign Up
  const handleToggle = (signInMode) => {
    setIsSignIn(signInMode);
  };

  // Welcome speech on page load
  useEffect(() => {
    setTimeout(() => {
      if (!speechSynthesis.speaking) {
        speechSynthesis.cancel();
        speakText("Welcome to the Login Page.");
      }
    }, 500);
  }, []);

  // Automatically start speech recognition on site startup
  useEffect(() => {
    startRecognition();
  }, []);

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={isSignIn}>
        <Components.Form>
          <Components.Title>Create Account</Components.Title>
          <Components.Input type="text" placeholder="Name" />
          <Components.Input
            type="email"
            placeholder="Email"
            onChange={handleEmailChange}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
          />
          <Components.Input
            type="number"
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
          />
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
          <Components.Button onClick={handleRegister}>
            Register as User
          </Components.Button>
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
          <Components.Input
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
          />
          <Components.Button type="submit">Sign In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={isSignIn}>
        <Components.Overlay signinIn={isSignIn}>
          <Components.LeftOverlayPanel signinIn={isSignIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              Please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => handleToggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>
          <Components.RightOverlayPanel signinIn={isSignIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter your personal details and start your journey
            </Components.Paragraph>
            <Components.GhostButton onClick={() => handleToggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default App;
