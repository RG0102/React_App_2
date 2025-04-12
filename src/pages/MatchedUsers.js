// import React, { useState, useEffect } from "react";
// import { collection, collectionGroup, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { auth, db } from "../firebase";
// import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

// // Jaccard Index & Cosine Similarity functions
// function jaccardIndex(interestsA, interestsB) {
//   const setA = new Set(interestsA);
//   const setB = new Set(interestsB);
//   const intersectionSize = [...setA].filter((item) => setB.has(item)).length;
//   const unionSize = new Set([...setA, ...setB]).size;
//   return unionSize > 0 ? intersectionSize / unionSize : 0;
// }

// function cosineSimilarity(interestsA, interestsB) {
//   const setA = new Set(interestsA);
//   const setB = new Set(interestsB);
//   const intersectionSize = [...setA].filter((item) => setB.has(item)).length;
//   const denom = Math.sqrt(setA.size) * Math.sqrt(setB.size);
//   return denom > 0 ? intersectionSize / denom : 0;
// }

// const MatchedUsers = () => {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();

//   const handleCommand = (command) => {
//     const lower = command.toLowerCase();
//     if (lower.includes("dashboard") || lower.includes("go back")) {
//       navigate("/dashboard");
//     } else if (lower.includes("chat with")) {
//       const name = command.split("chat with")[1].trim();
//       const found = matches.find(
//         (match) => match.name && match.name.toLowerCase() === name.toLowerCase()
//       );
//       if (found) {
//         navigate("/chat", { state: { userId: found.userId, userName: found.name } });
//       }
//     }
//   };
//   useSpeechRecognition(handleCommand);

//   const fetchProfiles = async (user) => {
//     const currentUserId = user.uid;
//     const myProfileSnapshot = await getDocs(collection(db, "users", currentUserId, "userProfiles"));
//     let myProfile = null;
//     myProfileSnapshot.forEach((doc) => {
//       if (!myProfile) myProfile = doc.data();
//     });
//     if (!myProfile || !myProfile.interests) {
//       setError("Your profile is incomplete. Please update your profile with your interests.");
//       setLoading(false);
//       return;
//     }
//     const profilesSnapshot = await getDocs(collectionGroup(db, "userProfiles"));
//     const allProfiles = [];
//     profilesSnapshot.forEach((doc) => {
//       const parentUserId = doc.ref.parent.parent.id;
//       if (parentUserId === currentUserId) return;
//       allProfiles.push({ id: doc.id, ...doc.data(), userId: parentUserId });
//     });
//     const computedMatches = allProfiles.map((profile) => {
//       const profileInterests = profile.interests || [];
//       const jIndex = jaccardIndex(myProfile.interests, profileInterests);
//       const cosSim = cosineSimilarity(myProfile.interests, profileInterests);
//       return { ...profile, compatibilityScore: (jIndex + cosSim) / 2 };
//     });
//     computedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
//     setMatches(computedMatches);
//     setLoading(false);
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       if (user) {
//         fetchProfiles(user);
//       } else {
//         setError("No authenticated user found.");
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSelectChange = (userId) => {
//     setSelectedUsers((prev) =>
//       prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
//     );
//   };

//   const handleCreateGroupChat = async () => {
//     if (!currentUser) return;
//     const title = window.prompt("Enter group chat title:");
//     if (!title) return;
//     const participants = [currentUser.uid, ...selectedUsers];
//     try {
//       const docRef = await addDoc(collection(db, "chats"), {
//         title,
//         participants,
//         createdAt: serverTimestamp(),
//         type: "group",
//       });
//       navigate("/groupchat", { state: { chatId: docRef.id, chatTitle: title, participants } });
//     } catch (err) {
//       console.error("Error creating group chat:", err);
//     }
//   };

//   const containerStyle = {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "16px",
//     justifyContent: "center",
//     padding: "20px",
//   };

//   const cardStyle = {
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     padding: "16px",
//     width: "250px",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//   };

//   const buttonStyle = {
//     marginTop: "8px",
//     padding: "8px 16px",
//     border: "none",
//     borderRadius: "4px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     cursor: "pointer",
//   };

//   if (loading) return <div>Loading matched users...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h2 style={{ textAlign: "center", marginTop: "20px" }}>Matched Users</h2>
//       {selectedUsers.length > 0 && (
//         <div style={{ textAlign: "center", marginBottom: "10px" }}>
//           <button style={buttonStyle} onClick={handleCreateGroupChat}>
//             Create Group Chat ({selectedUsers.length} selected)
//           </button>
//         </div>
//       )}
//       <div style={containerStyle}>
//         {matches.length === 0 ? (
//           <div style={{ textAlign: "center" }}>No matched users found.</div>
//         ) : (
//           matches.map((match) => (
//             <div key={match.id} style={cardStyle}>
//               <input
//                 type="checkbox"
//                 onChange={() => handleSelectChange(match.userId)}
//                 checked={selectedUsers.includes(match.userId)}
//                 style={{ marginRight: "8px" }}
//               />
//               <h3 style={{ display: "inline" }}>{match.name || "Unnamed User"}</h3>
//               <p>
//                 <strong>Compatibility:</strong> {(match.compatibilityScore * 100).toFixed(0)}%
//               </p>
//               <p>
//                 <strong>Hobbies:</strong>{" "}
//                 {match.interests ? match.interests.join(", ") : "N/A"}
//               </p>
//               <button
//                 style={buttonStyle}
//                 onClick={() =>
//                   navigate("/chat", { state: { userId: match.userId, userName: match.name } })
//                 }
//               >
//                 Chat
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MatchedUsers;

import React, { useState, useEffect } from "react";
import { collection, collectionGroup, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

// Jaccard Index & Cosine Similarity functions
function jaccardIndex(interestsA, interestsB) {
  const setA = new Set(interestsA);
  const setB = new Set(interestsB);
  const intersectionSize = [...setA].filter((item) => setB.has(item)).length;
  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize > 0 ? intersectionSize / unionSize : 0;
}

function cosineSimilarity(interestsA, interestsB) {
  const setA = new Set(interestsA);
  const setB = new Set(interestsB);
  const intersectionSize = [...setA].filter((item) => setB.has(item)).length;
  const denom = Math.sqrt(setA.size) * Math.sqrt(setB.size);
  return denom > 0 ? intersectionSize / denom : 0;
}

const MatchedUsers = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Updated handleCommand function to support "chat with", "talk with", or just the name.
  const handleCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes("dashboard") || lowerCommand.includes("go back")) {
      navigate("/dashboard");
      return;
    }

    let nameCandidate = "";
    if (lowerCommand.includes("chat with")) {
      nameCandidate = command.split("chat with")[1].trim();
    } else if (lowerCommand.includes("talk with")) {
      nameCandidate = command.split("talk with")[1].trim();
    } else {
      // Assume the whole command might be just the person's name.
      nameCandidate = command.trim();
    }

    // Try to match exactly first.
    let found = matches.find(
      (match) =>
        match.name && match.name.toLowerCase() === nameCandidate.toLowerCase()
    );

    // If not found, split the candidate into words and ensure all words appear in the match name.
    if (!found && nameCandidate) {
      const candidateWords = nameCandidate.toLowerCase().split(" ");
      found = matches.find((match) => {
        if (match.name) {
          const matchWords = match.name.toLowerCase().split(" ");
          return candidateWords.every((word) => matchWords.includes(word));
        }
        return false;
      });
    }

    if (found) {
      navigate("/chat", { state: { userId: found.userId, userName: found.name } });
    } else {
      console.log("No matching user found for command:", command);
    }
  };

  useSpeechRecognition(handleCommand);

  const fetchProfiles = async (user) => {
    const currentUserId = user.uid;
    const myProfileSnapshot = await getDocs(collection(db, "users", currentUserId, "userProfiles"));
    let myProfile = null;
    myProfileSnapshot.forEach((doc) => {
      if (!myProfile) myProfile = doc.data();
    });
    if (!myProfile || !myProfile.interests) {
      setError("Your profile is incomplete. Please update your profile with your interests.");
      setLoading(false);
      return;
    }
    const profilesSnapshot = await getDocs(collectionGroup(db, "userProfiles"));
    const allProfiles = [];
    profilesSnapshot.forEach((doc) => {
      const parentUserId = doc.ref.parent.parent.id;
      if (parentUserId === currentUserId) return;
      allProfiles.push({ id: doc.id, ...doc.data(), userId: parentUserId });
    });
    const computedMatches = allProfiles.map((profile) => {
      const profileInterests = profile.interests || [];
      const jIndex = jaccardIndex(myProfile.interests, profileInterests);
      const cosSim = cosineSimilarity(myProfile.interests, profileInterests);
      return { ...profile, compatibilityScore: (jIndex + cosSim) / 2 };
    });
    computedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    setMatches(computedMatches);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        fetchProfiles(user);
      } else {
        setError("No authenticated user found.");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSelectChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroupChat = async () => {
    if (!currentUser) return;
    const title = window.prompt("Enter group chat title:");
    if (!title) return;
    const participants = [currentUser.uid, ...selectedUsers];
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        title,
        participants,
        createdAt: serverTimestamp(),
        type: "group",
      });
      navigate("/groupchat", { state: { chatId: docRef.id, chatTitle: title, participants } });
    } catch (err) {
      console.error("Error creating group chat:", err);
    }
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "center",
    padding: "20px",
  };

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    width: "250px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const buttonStyle = {
    marginTop: "8px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  };

  if (loading) return <div>Loading matched users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Matched Users</h2>
      {selectedUsers.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button style={buttonStyle} onClick={handleCreateGroupChat}>
            Create Group Chat ({selectedUsers.length} selected)
          </button>
        </div>
      )}
      <div style={containerStyle}>
        {matches.length === 0 ? (
          <div style={{ textAlign: "center" }}>No matched users found.</div>
        ) : (
          matches.map((match) => (
            <div key={match.id} style={cardStyle}>
              <input
                type="checkbox"
                onChange={() => handleSelectChange(match.userId)}
                checked={selectedUsers.includes(match.userId)}
                style={{ marginRight: "8px" }}
              />
              <h3 style={{ display: "inline" }}>{match.name || "Unnamed User"}</h3>
              <p>
                <strong>Compatibility:</strong> {(match.compatibilityScore * 100).toFixed(0)}%
              </p>
              <p>
                <strong>Hobbies:</strong>{" "}
                {match.interests ? match.interests.join(", ") : "N/A"}
              </p>
              <button
                style={buttonStyle}
                onClick={() =>
                  navigate("/chat", { state: { userId: match.userId, userName: match.name } })
                }
              >
                Chat
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchedUsers;
