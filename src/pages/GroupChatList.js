import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const GroupChatsList = () => {
  const [groupChats, setGroupChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userNames, setUserNames] = useState({}); // Mapping: UID -> Name
  const navigate = useNavigate();

  // Helper to fetch a user's profile name from the subcollection.
  const fetchUserProfileName = async (uid) => {
    try {
      const profilesRef = collection(db, "users", uid, "userProfiles");
      const snapshot = await getDocs(profilesRef);
      if (!snapshot.empty) {
        // Use the first profile document found
        const profileData = snapshot.docs[0].data();
        return profileData.name || profileData.displayName || uid;
      }
      return uid;
    } catch (error) {
      console.error(`Error fetching profile for ${uid}:`, error);
      return uid;
    }
  };

  // Listen for group chats.
  useEffect(() => {
    console.log("Setting up auth subscription...");
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Authenticated user:", user.uid);
        setCurrentUser(user);
        const chatsRef = collection(db, "chats");
        // Query without orderBy to avoid composite index issues.
        const q = query(chatsRef, where("participants", "array-contains", user.uid));
        console.log("Group chats query created:", q);
        const unsubscribeChats = onSnapshot(
          q,
          (snapshot) => {
            console.log("Snapshot received. Size:", snapshot.size);
            const chats = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              console.log("Document found:", doc.id, data);
              chats.push({ id: doc.id, ...data });
            });
            setGroupChats(chats);
          },
          (error) => {
            console.error("Error in onSnapshot:", error);
          }
        );
        return () => {
          console.log("Cleaning up group chats subscription");
          unsubscribeChats();
        };
      } else {
        console.log("No authenticated user found.");
      }
    });
    return () => {
      console.log("Cleaning up auth subscription");
      unsubscribeAuth();
    };
  }, []);

  // Update mapping of user IDs to names based on participants from the group chats.
  useEffect(() => {
    if (groupChats.length > 0) {
      const uniqueIds = new Set();
      groupChats.forEach((chat) => {
        chat.participants.forEach((uid) => uniqueIds.add(uid));
      });
      // Filter out IDs we already have
      const idsToFetch = Array.from(uniqueIds).filter((uid) => !userNames[uid]);
      if (idsToFetch.length > 0) {
        Promise.all(idsToFetch.map((uid) => fetchUserProfileName(uid)))
          .then((names) => {
            const newMapping = { ...userNames };
            idsToFetch.forEach((uid, index) => {
              newMapping[uid] = names[index];
            });
            console.log("User names mapping updated:", newMapping);
            setUserNames(newMapping);
          })
          .catch((error) => {
            console.error("Error fetching user names:", error);
          });
      }
    }
  }, [groupChats, userNames]);

  const handleJoinChat = (chat) => {
    console.log("Joining chat:", chat);
    navigate("/groupchat", {
      state: { chatId: chat.id, chatTitle: chat.title, participants: chat.participants }
    });
  };

  const handleCommand = (command) => {
    console.log("Voice command received:", command);
    if (
      command.toLowerCase().includes("back") ||
      command.toLowerCase().includes("go back")
    ) {
      navigate("/dashboard");
    }
  };
  useSpeechRecognition(handleCommand);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Group Chats</h2>
      {groupChats.length === 0 ? (
        <p>No group chats found.</p>
      ) : (
        groupChats.map((chat) => (
          <div
            key={chat.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <h3>{chat.title}</h3>
            <p>
              <strong>Participants:</strong>{" "}
              {chat.participants
                .map((uid) => userNames[uid] || uid)
                .join(", ")}
            </p>
            <button onClick={() => handleJoinChat(chat)}>Join Chat</button>
          </div>
        ))
      )}
    </div>
  );
};

export default GroupChatsList;
