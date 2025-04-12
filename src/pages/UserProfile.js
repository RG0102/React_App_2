import React, { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";


const UserProfile2 = () => {
  const [name, setName] = useState('');
  const [genderPreference, setGenderPreference] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle saving profile
  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found.");
      }

      const userId = user.uid;

      // Prepare user profile data
      const userProfile = {
        name,
        genderPreference,
        location,
        interests,
        profilePicture: profilePictureUrl,
      };

      // Add a new profile in the user's 'userProfiles' sub-collection using the imported db
      const userProfilesCollection = collection(db, "users", userId, "userProfiles");
      await addDoc(userProfilesCollection, userProfile);

      setMessage('User Profile saved successfully!');

      // Clear the form fields after saving
      setName('');
      setGenderPreference('');
      setLocation('');
      setInterests([]);
      setProfilePictureUrl('');

      // Fetch and match profiles after saving
      fetchAndMatchProfiles(userId);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile. Please try again.');
    }
  };

  // Fetch and match profiles based on user's interests
  const fetchAndMatchProfiles = async (userUid) => {
    if (!userUid) return;
    try {
      const userProfilesRef = collection(db, 'users', userUid, 'userProfiles');
      const userProfilesSnapshot = await getDocs(userProfilesRef);
      const userProfiles = [];

      userProfilesSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.interests && userData.uid !== userUid) {
          userProfiles.push({ id: doc.id, ...userData });
        }
      });

      console.log("Fetched user profiles:", userProfiles);

      if (userProfiles.length === 0) {
        console.log("No profiles found.");
        setMessage("No profiles found to match with.");
        return;
      }

      // Calculate compatibility score for all users
      const matches = userProfiles.map(profile => {
        // Ensure that gender preference strictly matches (Male or Female)
        const isGenderMatch = (genderPreference === 'Male' && profile.genderPreference === 'Male') ||
                              (genderPreference === 'Female' && profile.genderPreference === 'Female');

        if (!isGenderMatch) {
          return null;
        }

        // Compare interests
        const commonInterests = profile.interests.filter(interest => interests.includes(interest));
        const compatibilityScore = commonInterests.length / Math.max(profile.interests.length, interests.length);

        return { ...profile, compatibilityScore };
      }).filter(match => match !== null);

      console.log("Matches with compatibility scores:", matches);

      // Sort matches by compatibility score (higher first)
      matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      if (matches.length === 0) {
        console.log("No matches found based on interests and gender preference.");
        setMessage("No matches found.");
        return;
      }

      console.log("Sorted matches:", matches);
      navigate('/dashboard', { state: { matches } });
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  // Handle profile picture upload
  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureUrl(URL.createObjectURL(file)); // Temporarily set image URL
    }
  };

  // Handle interest selection
  const handleInterestSelection = (interest) => {
    if (interests.includes(interest)) {
      setInterests(prev => prev.filter(i => i !== interest));
    } else if (interests.length < 3) {
      setInterests(prev => [...prev, interest]);
    } else {
      alert('You can only select up to three unique interests.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border border-info" style={{ width: '600px', padding: '30px', backgroundColor: '#f8f9fa' }}>
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ color: '#17a2b8', fontWeight: 'bold' }}>User Profile</h2>
          {profilePictureUrl && (
            <div className="text-center mb-4">
              <img src={profilePictureUrl} alt="Profile" className="rounded-circle border border-secondary" style={{ width: '100px', height: '100px' }} />
            </div>
          )}
          {message && <div className="alert alert-info text-center">{message}</div>}
          <form>
            <div className="form-group mb-3">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group mb-3">
              <label>Gender Preference</label>
              <select className="form-control" value={genderPreference} onChange={(e) => setGenderPreference(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Location</label>
              <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="form-group mb-3">
              <label>Interests (Select up to 3 unique interests)</label>
              <div className="d-flex flex-wrap mb-3">
                {["Reading", "Knitting", "Travelling", "Cooking", "Painting", "Bingo"].map(interest => (
                  <button
                    key={interest}
                    type="button"
                    className={`btn ${interests.includes(interest) ? 'btn-info' : 'btn-outline-info'} m-1`}
                    onClick={() => handleInterestSelection(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group mb-4">
              <label>Profile Picture</label>
              <input type="file" className="form-control-file" accept="image/*" onChange={handlePictureUpload} />
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-info" onClick={handleSaveProfile}>Save Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile2;



