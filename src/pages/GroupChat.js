import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import "../styles/Chat.css";  // Make sure the path to your CSS is correct

const GroupChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId, chatTitle, participants } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [participantNames, setParticipantNames] = useState({}); // Mapping: UID -> Name
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  // State for editing and emoji features
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  const messagesEndRef = useRef(null);

  // Listen for authenticated user.
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch current user's profile name from "users/{uid}/userProfiles"
  useEffect(() => {
    if (currentUser) {
      const fetchUserProfileName = async () => {
        try {
          const profilesRef = collection(db, "users", currentUser.uid, "userProfiles");
          const snapshot = await getDocs(profilesRef);
          if (!snapshot.empty) {
            const profileData = snapshot.docs[0].data();
            setCurrentUserName(profileData.name || profileData.displayName || "Unknown");
          } else {
            setCurrentUserName("Unknown");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUserName("Unknown");
        }
      };
      fetchUserProfileName();
    }
  }, [currentUser]);

  // Fetch display names for all participants from their "userProfiles"
  useEffect(() => {
    if (participants && participants.length > 0) {
      const uniqueIds = new Set(participants);
      const idsToFetch = Array.from(uniqueIds).filter((uid) => !participantNames[uid]);
      if (idsToFetch.length > 0) {
        Promise.all(
          idsToFetch.map(async (uid) => {
            try {
              const profilesRef = collection(db, "users", uid, "userProfiles");
              const snapshot = await getDocs(profilesRef);
              if (!snapshot.empty) {
                const profileData = snapshot.docs[0].data();
                return { uid, name: profileData.name || profileData.displayName || uid };
              }
              return { uid, name: uid };
            } catch (error) {
              console.error(`Error fetching profile for ${uid}:`, error);
              return { uid, name: uid };
            }
          })
        )
          .then((results) => {
            const newMapping = { ...participantNames };
            results.forEach(({ uid, name }) => {
              newMapping[uid] = name;
            });
            setParticipantNames(newMapping);
          })
          .catch((error) => {
            console.error("Error fetching participant names:", error);
          });
      }
    }
  }, [participants, participantNames]);

  // Listen for messages in the chat.
  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !currentUser) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    try {
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUserName,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", msgId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEditMessage = async (msgId) => {
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", msgId), { text: editingText });
      setEditingMessageId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteGroupChat = async () => {
    try {
      await deleteDoc(doc(db, "chats", chatId));
      navigate("/matchedusers");
    } catch (error) {
      console.error("Error deleting group chat:", error);
    }
  };

  // Array of emojis for the emoji picker.
  const emojis = ['😀', '😂', '😍', '👍', '🙏', '😎', '🤔', '🎉', '🥳', '😇'];

  if (!chatId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Error: Missing group chat data. Please return to the matched users page.</p>
        <button onClick={() => navigate("/matchedusers")}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
      <h2>{chatTitle || "Group Chat"}</h2>
      <div>
        <strong>Participants:</strong>{" "}
        {participants && participants.map((uid) => participantNames[uid] || uid).join(", ")}
      </div>
      <button onClick={handleDeleteGroupChat} style={{ marginTop: "10px", padding: "5px 10px" }}>
        Delete Group Chat
      </button>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px 0",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="message-container"
            onMouseEnter={() => setHoveredMessageId(msg.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
            style={{
              marginBottom: "10px",
              textAlign: msg.senderId === currentUser?.uid ? "right" : "left",
            }}
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
                  <button onClick={() => { setEditingMessageId(null); setEditingText(""); }}>
                    Cancel
                  </button>
                </>
              ) : (
                <div>{msg.text}</div>
              )}
      {msg.senderId === currentUser?.uid && (
        <div
          className="message-actions"
          style={{
            display: hoveredMessageId === msg.id ? 'flex' : 'none',
            position: 'absolute',
            top: '-10px',
            left: '-25px',
            gap: '5px'
          }}
        >
          <button 
            className="icon-button"
            onClick={() => { setEditingMessageId(msg.id); setEditingText(msg.text); }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            title="Edit"
          >
            &#9998;
          </button>
          <button 
            className="icon-button"
            onClick={() => handleDeleteMessage(msg.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
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
      </div>
      {showEmojiPicker && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "10px",
            border: "1px solid #ccc",
            marginTop: "10px",
          }}
        >
          {emojis.map((emoji, index) => (
            <span
              key={index}
              style={{
                fontSize: "1.5em",
                cursor: "pointer",
                marginRight: "5px",
                marginBottom: "5px",
              }}
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

export default GroupChat;
