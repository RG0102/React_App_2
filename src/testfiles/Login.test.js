// Polyfills must be defined before any imports.
import '@testing-library/jest-dom';

global.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.rate = 1;
    this.pitch = 1;
  }
};

global.SpeechRecognition = function() {
  this.start = jest.fn();
  this.continuous = false;
  this.lang = "en-US";
  this.interimResults = false;
  this.maxAlternatives = 1;
};
global.webkitSpeechRecognition = global.SpeechRecognition;

import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Login from "../pages/Login"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";

// --- Mocks ---
// Mock react-router-dom's useNavigate.
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock Firebase module.
jest.mock("../firebase", () => ({
  auth: {},
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  firestore: {},
}));

// Mock Firestore functions.
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(() => ({})),
  setDoc: jest.fn(),
}));

// Mock Components (adjust the module path as needed).
jest.mock("../pages/Components", () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  SignUpContainer: ({ children, signinIn }) => (
    <div data-testid="signup-container">{children}</div>
  ),
  Form: ({ children, onSubmit, testid }) => (
    <form onSubmit={onSubmit} data-testid={testid || "form"}>{children}</form>
  ),
  Title: ({ children }) => <h1>{children}</h1>,
  Input: (props) => <input {...props} data-testid={props.placeholder} />,
  PrivacyContainer: ({ children }) => <div data-testid="privacy">{children}</div>,
  Checkbox: (props) => <input type="checkbox" {...props} data-testid="checkbox" />,
  Label: ({ children }) => <label>{children}</label>,
  Button: (props) => <button {...props} data-testid="button">{props.children}</button>,
  SignInContainer: ({ children, signinIn }) => (
    <div data-testid="signin-container">{children}</div>
  ),
  OverlayContainer: ({ children, signinIn }) => (
    <div data-testid="overlay-container">{children}</div>
  ),
  Overlay: ({ children, signinIn }) => <div data-testid="overlay">{children}</div>,
  LeftOverlayPanel: ({ children, signinIn }) => (
    <div data-testid="left-panel">{children}</div>
  ),
  RightOverlayPanel: ({ children, signinIn }) => (
    <div data-testid="right-panel">{children}</div>
  ),
  GhostButton: (props) => <button {...props} data-testid="ghost-button">{props.children}</button>,
  Paragraph: ({ children }) => <p>{children}</p>,
}));

// Mock the global speechSynthesis object.
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  speaking: false,
};

describe("Login component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders both sign in and create account interfaces", () => {
    render(<Login />);
    const signInContainer = screen.getByTestId("signin-container");
    const signUpContainer = screen.getByTestId("signup-container");

    expect(
      within(signInContainer).getByRole("heading", { name: /Sign in/i })
    ).toBeInTheDocument();
    expect(
      within(signUpContainer).getByRole("heading", { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  test("handles email input change with delayed speech", async () => {
    jest.useFakeTimers();
    render(<Login />);
    const signInContainer = screen.getByTestId("signin-container");
    const emailInput = within(signInContainer).getByTestId("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    jest.advanceTimersByTime(1100);
    await waitFor(() => {
      expect(global.speechSynthesis.speak).toHaveBeenCalled();
    });
    jest.useRealTimers();
  });

  test("sign in flow calls signInWithEmailAndPassword and navigates based on user role and age", async () => {
    const fakeUser = { uid: "123" };
    const fakeUserCredential = { user: fakeUser };
    signInWithEmailAndPassword.mockResolvedValue(fakeUserCredential);
    getDoc.mockResolvedValue({
      data: () => ({ role: "user", age: "55" }),
    });
    
    render(<Login />);
    const signInContainer = screen.getByTestId("signin-container");
    const emailInput = within(signInContainer).getByTestId("Email");
    const passwordInput = within(signInContainer).getByTestId("Password");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    
    const signInButton = within(signInContainer).getByRole("button", {
      name: /^Sign In$/i,
    });
    fireEvent.click(signInButton);
    
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "user@example.com",
      "password"
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/Dashboard");
    });
  });

  test("registration shows error if privacy policy is not accepted", async () => {
    render(<Login />);
    const signUpContainer = screen.getByTestId("signup-container");
    const registerButton = within(signUpContainer).getByRole("button", {
      name: /Register as User/i,
    });
    fireEvent.click(registerButton);
    await waitFor(() => {
      expect(global.speechSynthesis.speak).toHaveBeenCalled();
    });
  });

  test("registration flow calls createUserWithEmailAndPassword, setDoc and navigates based on age", async () => {
    const fakeUser = { uid: "456" };
    const fakeUserCredential = { user: fakeUser };
    createUserWithEmailAndPassword.mockResolvedValue(fakeUserCredential);
    setDoc.mockResolvedValue(null);
    
    render(<Login />);
    const signUpContainer = screen.getByTestId("signup-container");
    const emailInput = within(signUpContainer).getByTestId("Email");
    const passwordInput = within(signUpContainer).getByTestId("Password");
    const ageInput = within(signUpContainer).getByTestId("Age");
    const checkbox = within(signUpContainer).getByTestId("checkbox");
    
    fireEvent.change(emailInput, { target: { value: "newuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    fireEvent.change(ageInput, { target: { value: "45" } });
    // For checkboxes, using click is a standard way to toggle the value.
    fireEvent.click(checkbox);
    
    // Wait for the state update so that agreeToPolicy becomes true.
    await waitFor(() => {
      expect(checkbox.checked).toBe(true);
    });
    
    const registerButton = within(signUpContainer).getByRole("button", {
      name: /Register as User/i,
    });
    fireEvent.click(registerButton);
    
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "newuser@example.com",
      "newpassword"
    );
    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user-profile");
    });
  });
});
