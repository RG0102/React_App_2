import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Components from "./Components2";

function App() {
    const [signIn, toggle] = useState(true);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // Speech Synthesis function
    const speakText = (text) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1; // Set the speaking rate
            utterance.pitch = 1; // Set the speaking pitch
            speechSynthesis.speak(utterance);
        } else {
            console.error("Speech Synthesis not supported in this browser.");
        }
    };

    // Speech Recognition function
    const startSpeechRecognition = (callback) => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const recognition = new (window.SpeechRecognition ||
                window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.onresult = (event) => {
                const speech = event.results[0][0].transcript.toLowerCase();
                callback(speech);
            };
            recognition.onerror = (err) => {
                console.error("Speech Recognition Error:", err);
                speakText("Sorry, I didn't catch that. Please try again.");
            };
            recognition.start();
        } else {
            speakText("Speech Recognition is not supported in this browser.");
        }
    };

    const handleEmailChange = (e) => {
        const emailInput = e.target.value;
        setEmail(emailInput);
    
        // You can add any other logic you need here
        if (emailInput) {
            clearTimeout(window.emailTypingTimeout);
            window.emailTypingTimeout = setTimeout(() => {
                speakText(`You have entered the email: ${emailInput}`);
            }, 1000);
        }
    };

    // Function to handle Sign-In
    const handleSignIn = (e) => {
        e.preventDefault();
        speakText("Do you want to sign in?");

        // Wait for 2 seconds and then sign in automatically
        setTimeout(() => {
            speakText("Signing you in.");
            navigate("/user"); // Redirect to user page
        }, 2000); // 2-second delay before signing in
    };

    // Function to prompt the user when toggling to Sign In page
    const handleToggle = (isSignIn) => {
        if (isSignIn) {
            speakText("Welcome back! Please enter your email and password to sign in.");
        } else {
            speakText("Hello friend! Please sign up to get started.");
        }
        toggle(isSignIn);
    };

    useEffect(() => {
        // When the app loads for the first time, welcome the user and then prompt for email
        if (!localStorage.getItem("welcomeMessageSpoken")) {
            speakText("Welcome to the Volunteer Login Page.");
            localStorage.setItem("welcomeMessageSpoken", "true");
        }
    }, []);

    return (
        <Components.Container>
            <Components.SignUpContainer signinIn={signIn}>
                <Components.Form>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input type="text" placeholder="Name" />
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button onClick={() => speakText("Signing up. Please wait.")}>
                        Sign Up
                    </Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.SignInContainer signinIn={signIn}>
                <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Sign in</Components.Title>
                    <Components.Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button type="submit">Sign In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>
                    <Components.LeftOverlayPanel signinIn={signIn}>
                        <Components.Title>Welcome Back!</Components.Title>
                        <Components.Paragraph>
                            To keep connected with us please login with your personal info
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => handleToggle(true)}>
                            Sign In
                        </Components.GhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel signinIn={signIn}>
                        <Components.Title>Hello, Friend!</Components.Title>
                        <Components.Paragraph>
                            Enter Your personal details and start your journey with us
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
