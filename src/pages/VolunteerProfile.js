import React, { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";


const VolunteerProfile = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [passportPhotoUrl, setPassportPhotoUrl] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();



  // Handle passport photo upload
  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // For now, we're using a temporary URL.
      setPassportPhotoUrl(URL.createObjectURL(file));
    }
  };

  // Handle saving the volunteer profile
  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found.");
      }
      const userId = user.uid;

      // Prepare volunteer profile data
      const volunteerProfile = {
        name,
        gender,
        address,
        phoneNumber,
        age,
        specialization,
        passportPhoto: passportPhotoUrl,
        role: "volunteer",
      };

      // Save the volunteer profile in the "volunteers" collection with the volunteer's UID as the document ID
      await setDoc(doc(db, "volunteers", userId), volunteerProfile);

      setMessage('Profile saved successfully!');
      // Optionally, navigate to the volunteer services page or another part of your app:
      navigate(parseInt(age, 10) > 18 ? "/VolunteerService" : "/home");
    } catch (error) {
      console.error('Error saving volunteer profile:', error);
      setMessage('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border border-info" style={{ width: '600px', padding: '30px', backgroundColor: '#f8f9fa' }}>
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ color: '#17a2b8', fontWeight: 'bold' }}>Volunteer Profile</h2>
          {passportPhotoUrl && (
            <div className="text-center mb-4">
              <img 
                src={passportPhotoUrl} 
                alt="Passport" 
                className="rounded border border-secondary" 
                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
              />
            </div>
          )}
          {message && <div className="alert alert-info text-center">{message}</div>}
          <form>
            <div className="form-group mb-3">
              <label>Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label>Gender</label>
              <select 
                className="form-control" 
                value={gender} 
                onChange={e => setGender(e.target.value)} 
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Address</label>
              <input 
                type="text" 
                className="form-control" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label>Phone Number</label>
              <input 
                type="tel" 
                className="form-control" 
                value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label>Age</label>
              <input 
                type="number" 
                className="form-control" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label>Specialization</label>
              <select 
                className="form-control" 
                value={specialization} 
                onChange={e => setSpecialization(e.target.value)} 
                required
              >
                <option value="">Select Specialization</option>
                <option value="Tech">Tech</option>
                <option value="Supplies">Supplies</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label>Passport Photo</label>
              <input 
                type="file" 
                className="form-control-file" 
                accept="image/*" 
                onChange={handlePictureUpload} 
                required 
              />
            </div>
            <div className="text-center">
              <button 
                type="button" 
                className="btn btn-info" 
                onClick={handleSaveProfile}
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
