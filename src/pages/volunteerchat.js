import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
import "../styles/Chat.css";

const VolunteerChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect the user’s id and name passed as state from VolunteerService.
  const { chatPartnerId, chatPartnerName } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Voice commands (e.g. “back” to return to help)
  const handleCommand = (command) => {
    if (command.includes("back") || command.includes("go back")) {
      navigate("/help");
    }
  };
  useSpeechRecognition(handleCommand);

  // Listen for the authenticated volunteer
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.error("No authenticated user found");
        alert("You are not authenticated!");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Now that we have the currentUser and the user's id from state, create a chat room
  // The chat id is built solely from the user's id (with a prefix).
  useEffect(() => {
    if (chatPartnerId) {
      setChatId(`volchat_${chatPartnerId}`);
    }
  }, [chatPartnerId]);

  // Listen for messages in the chat room.
  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = [];
        snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      (error) => {
        console.error("Error fetching messages:", error);
        alert("Error fetching messages: " + error.message);
      }
    );
    return () => unsubscribe();
  }, [chatId]);

  // Send a new message, optionally with an image.
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !newImage) return;
    if (!chatId || !currentUser) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    try {
      let imageUrl = "";
      if (newImage) {
        const imageRef = ref(storage, `chatImages/${chatId}/${Date.now()}_${newImage.name}`);
        const snapshot = await uploadBytes(imageRef, newImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await addDoc(messagesRef, {
        text: newMessage,
        imageUrl,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
      setNewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message: " + error.message);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", msgId));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message: " + error.message);
    }
  };

  const handleEditMessage = async (msgId) => {
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
        text: editingText,
      });
      setEditingMessageId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Error editing message: " + error.message);
    }
  };

  const emojis = ["😀", "😂", "😍", "👍", "🙏", "😎", "🤔", "🎉", "🥳", "😇"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
      <h2>Chat with {chatPartnerName || "User"}</h2>
      <div style={{ flex: 1, overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="message-container"
            onMouseEnter={() => setHoveredMessageId(msg.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
            style={{ marginBottom: "10px", textAlign: msg.senderId === currentUser?.uid ? "right" : "left" }}
          >
            <div
              className="message-bubble"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "8px",
                background: msg.senderId === currentUser?.uid ? "#dcf8c6" : "#fff",
                border: "1px solid #ccc",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "0.85em", marginBottom: "4px", color: "#555" }}>
                {msg.senderName}
              </div>
              {editingMessageId === msg.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ width: "80%" }}
                  />
                  <button onClick={() => handleEditMessage(msg.id)}>Save</button>
                  <button onClick={() => { setEditingMessageId(null); setEditingText(""); }}>Cancel</button>
                </>
              ) : (
                <>
                  {msg.text && <div>{msg.text}</div>}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="sent"
                      style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "5px" }}
                    />
                  )}
                </>
              )}
              {msg.senderId === currentUser?.uid && (
                <div
                  className="message-actions"
                  style={{
                    display: hoveredMessageId === msg.id ? "flex" : "none",
                    position: "absolute",
                    top: "-5px",
                    left: "-12px",
                    gap: "5px",
                  }}
                >
                  <button
                    className="icon-button"
                    onClick={() => { setEditingMessageId(msg.id); setEditingText(msg.text); }}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
                    title="Edit"
                  >
                    &#9998;
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => handleDeleteMessage(msg.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
                    title="Delete"
                  >
                    &#10006;
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: "10px" }}>
          😀
        </button>
        <button onClick={handleSendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
        <button
          onClick={() => fileInputRef.current.click()}
          style={{ padding: "10px 20px", marginLeft: "5px" }}
        >
          Send Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setNewImage(e.target.files[0]);
            }
          }}
        />
      </div>
      {showEmojiPicker && (
        <div style={{ display: "flex", flexWrap: "wrap", padding: "10px", border: "1px solid #ccc", marginTop: "10px" }}>
          {emojis.map((emoji, index) => (
            <span
              key={index}
              style={{ fontSize: "1.5em", cursor: "pointer", marginRight: "5px", marginBottom: "5px" }}
              onClick={() => {
                setNewMessage(newMessage + emoji);
                setShowEmojiPicker(false);
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerChat;
