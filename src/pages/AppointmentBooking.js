import React, { useState } from "react";
import "../styles/AppointmentBooking.css";

function AppointmentBooking() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [error, setError] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Check if all fields are filled
        if (!name || !date || !time) {
            setError("Please fill out all fields.");
            setConfirmationMessage("");
            // Trigger speech to ask user to complete the form
            speakMessage("Please fill out all the fields.");
        } else {
            setError("");
            const message = `Appointment booked for ${name} on ${date} at ${time}.`;
            setConfirmationMessage(message);

            // Trigger speech to confirm the booking
            speakMessage(message);
        }
    };

    const speakMessage = (message) => {
        const synth = window.speechSynthesis;

        // Stop any ongoing speech
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "en-US";
        synth.speak(utterance);
    };

    return (
        <div className="appointment-container">
            <h2>Book an Appointment</h2>
            <form className="vertical-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                <button type="submit">Book Appointment</button>
            </form>

            {error && <p className="error">{error}</p>}
            {confirmationMessage && <p className="success">{confirmationMessage}</p>}
        </div>
    );
}

export default AppointmentBooking;
