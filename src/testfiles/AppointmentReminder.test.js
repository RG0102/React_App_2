// AppointmentReminder.test.js
import React from "react";
import "@testing-library/jest-dom"; // Import jest-dom for custom matchers
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentReminder from "../pages/AppointmentReminder";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

// Mock useNavigate and useSpeechRecognition
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useSpeechRecognition", () => jest.fn());

describe("AppointmentReminder", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders the component", () => {
    render(<AppointmentReminder />);
    expect(screen.getByText("⏰ Appointment Reminder ⏰")).toBeInTheDocument();
  });

  test("navigates to /manageappointment when Manage Appointments button is clicked", () => {
    render(<AppointmentReminder />);
    const manageButton = screen.getByText("Manage Appointments");
    fireEvent.click(manageButton);
    expect(mockNavigate).toHaveBeenCalledWith("/manageappointment");
  });

  test("navigates to /help when Back to Volunteer Services button is clicked", () => {
    render(<AppointmentReminder />);
    const backButton = screen.getByText("Back to Volunteer Services");
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/help");
  });

  test("calls navigate when voice command includes 'back'", () => {
    render(<AppointmentReminder />);
    // Capture the callback provided to useSpeechRecognition
    const voiceCallback = useSpeechRecognition.mock.calls[0][0];
    voiceCallback("please go back now");
    expect(mockNavigate).toHaveBeenCalledWith("/help");
  });

  test("does not navigate if command does not include a navigation keyword", () => {
    render(<AppointmentReminder />);
    const voiceCallback = useSpeechRecognition.mock.calls[0][0];
    voiceCallback("do something else");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
