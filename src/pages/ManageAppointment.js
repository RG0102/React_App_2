import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";

const ManageAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [editAppointment, setEditAppointment] = useState(null);
  const [updatedData, setUpdatedData] = useState({});


      // Define how to handle commands
    const handleCommand = (command) => {
      console.log("Command received:", command);
      if (command.includes("back") || command.includes("go back")) {
        navigate("/help");
      } else {
        console.log("No matching navigation command.");
      }
    };
    
    // Use the custom hook
    useSpeechRecognition(handleCommand);
    

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      setAppointments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const handleEdit = (appointment) => {
    setEditAppointment(appointment);
    setUpdatedData(appointment);
  };

  const handleUpdate = async () => {
    if (editAppointment) {
      await updateDoc(doc(db, "appointments", editAppointment.id), updatedData);
      setAppointments(appointments.map(appt => appt.id === editAppointment.id ? updatedData : appt));
      setEditAppointment(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">📋 Manage Appointments 📋</h1>
      <button className="btn btn-primary mb-3" onClick={() => navigate("/bookappointment")}>Book New Appointment</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Service</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.name}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.location}</td>
              <td>{appointment.service}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(appointment)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(appointment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editAppointment && (
        <div className="mt-4">
          <h3>Edit Appointment</h3>
          <input type="text" className="form-control mb-2" placeholder="Name" value={updatedData.name} onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })} />
          <input type="date" className="form-control mb-2" value={updatedData.date} onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })} />
          <input type="time" className="form-control mb-2" value={updatedData.time} onChange={(e) => setUpdatedData({ ...updatedData, time: e.target.value })} />
          <input type="text" className="form-control mb-2" placeholder="Location" value={updatedData.location} onChange={(e) => setUpdatedData({ ...updatedData, location: e.target.value })} />
          <input type="text" className="form-control mb-2" placeholder="Service" value={updatedData.service} onChange={(e) => setUpdatedData({ ...updatedData, service: e.target.value })} />
          <button className="btn btn-success" onClick={handleUpdate}>Update</button>
          <button className="btn btn-secondary ms-2" onClick={() => setEditAppointment(null)}>Cancel</button>
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/help')}>
        Back to Volunteer Services
      </button>
    </div>

    
  );
};

export default ManageAppointment;
