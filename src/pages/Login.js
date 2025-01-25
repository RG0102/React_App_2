import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Components from './Components';

function App() {
    const [signIn, toggle] = useState(true);
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        navigate("/user"); // Redirect to user page
    };

    return (
        <Components.Container>
            <Components.SignUpContainer signinIn={signIn}>
                <Components.Form>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input type="text" placeholder="Name" />
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button>Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.SignInContainer signinIn={signIn}>
                <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Sign in</Components.Title>
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button type="submit">Sign In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>
                    <Components.LeftOverlayPanel signinIn={signIn}>
                        <Components.Title>Welcome Back!</Components.Title>
                        <Components.Paragraph>
                            "Please login with your personal info"
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(true)}>
                            Sign In
                        </Components.GhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel signinIn={signIn}>
                        <Components.Title>Hello, Friend!</Components.Title>
                        <Components.Paragraph>
                            """" Enter Your personal details and start your journey "
                        </Components.Paragraph>
                        <Components.GhostButton onClick={() => toggle(false)}>
                            Sign Up
                        </Components.GhostButton>
                    </Components.RightOverlayPanel>
                </Components.Overlay>
            </Components.OverlayContainer>
        </Components.Container>
    );
}

export default App;
