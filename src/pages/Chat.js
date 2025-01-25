import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to get state from navigation
import { addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase"; // Ensure firebase.js is correctly configured
import "../styles/Chat.css";

function Chat() {
    const { state } = useLocation(); // Get state passed from the UserProfile
    const { user, chatUser } = state || {}; // Destructure user and chatUser

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Fetch messages in real-time between the user and chatUser
    useEffect(() => {
        if (user?.email && chatUser?.email) {
            const q = query(
                collection(firestore, "messages"),
                where("sender", "in", [user.email, chatUser.email]),
                where("receiver", "in", [user.email, chatUser.email])
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages = querySnapshot.docs.map((doc) => doc.data());
                setMessages(
                    fetchedMessages.sort(
                        (a, b) =>
                            (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)
                    )
                );
            });

            return () => unsubscribe();
        }
    }, [user, chatUser]);

    // Send a new message
    const sendMessage = async () => {
        if (message.trim() && user?.email && chatUser?.email) {
            try {
                await addDoc(collection(firestore, "messages"), {
                    text: message,
                    sender: user.email,
                    receiver: chatUser.email,
                    timestamp: new Date(),
                });
                setMessage("");
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        }
    };

    if (!chatUser) {
        return <div>No chat user selected</div>;
    }

    return (
        <div className="chat-container">
            <h3>Chat with {chatUser.name}</h3>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === user.email ? "sent" : "received"}`}
                    >
                        <p>
                            {msg.sender === user.email ? "You: " : `${chatUser.name}: `}
                            {msg.text}
                        </p>
                    </div>
                ))}
            </div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;
