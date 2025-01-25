import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';  // Ensure firebase.js is correctly configured
import "../styles/UserProfile.css"; 

function UserProfile() {
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState('');
    const [userInterests, setUserInterests] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [matches, setMatches] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

    // Sample users for matching
    const users = [
        { name: 'John Doe', interests: 'Reading, Travelling, Cooking', email: 'john@example.com' },
        { name: 'Jane Smith', interests: 'Traveling, Reading, Photography', email: 'jane@example.com' },
        { name: 'Emily Clark', interests: 'Cooking, Painting, Nature', email: 'emily@example.com' },
    ];

    // Firebase Authentication listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), setUser);
        return () => unsubscribe();
    }, []);

    // Handle form submission and calculate matches
    const handleProfileSubmit = () => {
        const processedUserInterests = preprocessText(userInterests);

        // Calculate similarity scores
        const similarityScores = users.map(user => {
            const processedOtherUserInterests = preprocessText(user.interests);
            return {
                name: user.name,
                email: user.email,
                compatibility: calculateCompatibility(processedUserInterests, processedOtherUserInterests),
            };
        });

        // Sort and display the top matches
        const sortedMatches = similarityScores
            .sort((a, b) => b.compatibility - a.compatibility)
            .slice(0, 3); // Display top 3 matches

        setMatches(sortedMatches);
    };

    // Preprocess text by tokenizing and removing stopwords
    const preprocessText = (text) => {
        return text.toLowerCase().split(',').map(interest => interest.trim());
    };

    // Calculate compatibility based on common interests
    const calculateCompatibility = (userInterests, otherUserInterests) => {
        const commonInterests = userInterests.filter(interest => otherUserInterests.includes(interest));
        return (commonInterests.length / userInterests.length) * 100; // Compatibility score
    };

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUserImage(URL.createObjectURL(file));
        }
    };

    // Handle chat click (this is where you set the selected chat user)
    const handleChatClick = (matchedUser) => {
        setChatUser(matchedUser); // Set the selected chat user
    };

    // Send message function
    const sendMessage = async () => {
        if (message.trim() && user && chatUser) {
            try {
                await addDoc(collection(firestore, 'messages'), {
                    text: message,
                    sender: user.email,
                    receiver: chatUser.email,
                    timestamp: new Date(),
                });
                setMessage('');  // Clear the message input field
                fetchMessages();  // Optionally, fetch the latest messages after sending
            } catch (error) {
                console.error('Error sending message: ', error);
            }
        }
    };

    // Fetch messages between the user and chatUser
    const fetchMessages = () => {
        if (user && chatUser) {
            const q = query(
                collection(firestore, 'messages'),
                where('sender', 'in', [user.email, chatUser.email]),
                where('receiver', 'in', [user.email, chatUser.email])
            );
            getDocs(q).then(querySnapshot => {
                const fetchedMessages = querySnapshot.docs.map(doc => doc.data());
                setMessages(fetchedMessages);
            });
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [user, chatUser]);  // Fetch messages when user or chatUser changes

    return (
        <div className="user-profile-container">
            <h2>User Profile</h2>
            <div className="user-image">
                {userImage && <img src={userImage} alt="User" width="150" />}
            </div>

            <form>
                <label>Name:</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                />
                <label>Age:</label>
                <input
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    placeholder="Enter your age"
                />
                <label>Interests:</label>
                <textarea
                    value={userInterests}
                    onChange={(e) => setUserInterests(e.target.value)}
                    placeholder="Enter your interests (separate with commas)"
                />
                <label>Upload Image:</label>
                {!userImage && (
                    <input
                        type="file"
                        onChange={handleImageUpload}
                    />
                )}
                <button type="button" onClick={handleProfileSubmit}>Submit</button>
            </form>

            <div className="matches">
                <h3>Suggested Matches:</h3>
                {matches.length > 0 ? (
                    matches.map((match, index) => (
                        <div key={index}>
                            <h4>{match.name}</h4>
                            <p>Compatibility: {match.compatibility.toFixed(2)}%</p>
                            <button onClick={() => handleChatClick(match)}>Chat with {match.name}</button>
                        </div>
                    ))
                ) : (
                    <p>No matches found</p>
                )}
            </div>

            {chatUser && (
                <div className="chat-container">
                    <h3>Chat with {chatUser.name}</h3>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <p>{msg.sender === user.email ? 'You: ' : `${chatUser.name}: `}{msg.text}</p>
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
            )}
        </div>
    );
}

export default UserProfile;
