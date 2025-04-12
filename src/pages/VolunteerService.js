// // import React, { useState, useEffect } from "react";
// // import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// // import { db } from "../firebase.js";
// // import { useNavigate } from "react-router-dom";
// // import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
// // import "bootstrap/dist/css/bootstrap.min.css";

// // const VolunteerService = () => {
// //   const navigate = useNavigate();
// //   const [appointments, setAppointments] = useState([]);
// //   const [activeTab, setActiveTab] = useState("TechHelp");

// //   // Define the service types (task categories)
// //   const serviceTypes = ["TechHelp", "GroceryHelp", "AppointmentReminder", "Bingo"];

// //   // Fetch all appointments, ordered by date then time.
// //   useEffect(() => {
// //     const appointmentsRef = collection(db, "appointments");
// //     // Ordering by date and then time (assuming proper format)
// //     const q = query(appointmentsRef, orderBy("date"), orderBy("time"));
// //     const unsubscribe = onSnapshot(q, (snapshot) => {
// //       const apps = [];
// //       snapshot.forEach((doc) => apps.push({ id: doc.id, ...doc.data() }));
// //       setAppointments(apps);
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   // Group appointments by service type.
// //   const appointmentsByService = serviceTypes.reduce((acc, service) => {
// //     acc[service] = appointments.filter(app => app.service === service);
// //     return acc;
// //   }, {});

// //   // Voice commands: go back to the dashboard.
// //   const handleCommand = (command) => {
// //     if (
// //       command.toLowerCase().includes("back") ||
// //       command.toLowerCase().includes("go back")
// //     ) {
// //       navigate("/dashboard");
// //     }
// //   };
// //   useSpeechRecognition(handleCommand);

// //   return (
// //     <div className="container mt-5">
// //       <h1 className="text-center">Volunteer Service - Process Appointments</h1>
// //       <ul className="nav nav-tabs">
// //         {serviceTypes.map(service => (
// //           <li className="nav-item" key={service}>
// //             <a
// //               className={`nav-link ${activeTab === service ? "active" : ""}`}
// //               onClick={() => setActiveTab(service)}
// //               style={{ cursor: "pointer" }}
// //             >
// //               {service}
// //             </a>
// //           </li>
// //         ))}
// //       </ul>
// //       <div className="tab-content mt-4">
// //         {serviceTypes.map(service => (
// //           <div
// //             key={service}
// //             className={`tab-pane fade ${activeTab === service ? "show active" : ""}`}
// //           >
// //             {appointmentsByService[service] && appointmentsByService[service].length > 0 ? (
// //               appointmentsByService[service].map(app => (
// //                 <div key={app.id} className="card mb-3">
// //                   <div className="card-body">
// //                     <h5 className="card-title">{app.name}</h5>
// //                     <p className="card-text">
// //                       <strong>Date:</strong> {app.date}<br />
// //                       <strong>Time:</strong> {app.time}<br />
// //                       <strong>Location:</strong> {app.location}
// //                     </p>
// //                     <button
// //                       className="btn btn-primary mt-2"
// //                       onClick={() =>
// //                         navigate("/chat", { state: { userId: app.userId, userName: app.name } })
// //                       }
// //                     >
// //                       Chat with User
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p>No appointments found for {service}.</p>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //       <button className="btn btn-secondary mt-4" onClick={() => navigate("/dashboard")}>
// //         Back to Dashboard
// //       </button>
// //     </div>
// //   );
// // };

// // export default VolunteerService;
// import React, { useState, useEffect } from "react";
// import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase.js";
// import { useNavigate } from "react-router-dom";
// import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
// import "bootstrap/dist/css/bootstrap.min.css";

// const VolunteerService = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [activeTab, setActiveTab] = useState("TechHelp");

//   // Define the service types (task categories)
//   const serviceTypes = ["TechHelp", "GroceryHelp", "AppointmentReminder", "Bingo"];

//   // Fetch all appointments ordered by the combined timestamp.
//   useEffect(() => {
//     const appointmentsRef = collection(db, "appointments");
//     const q = query(appointmentsRef, orderBy("timestamp"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const apps = [];
//       snapshot.forEach((doc) => apps.push({ id: doc.id, ...doc.data() }));
//       setAppointments(apps);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Group appointments by service type.
//   const appointmentsByService = serviceTypes.reduce((acc, service) => {
//     acc[service] = appointments.filter((app) => app.service === service);
//     return acc;
//   }, {});

//   // Voice command: go back to the dashboard.
//   const handleCommand = (command) => {
//     if (
//       command.toLowerCase().includes("back") ||
//       command.toLowerCase().includes("go back")
//     ) {
//       navigate("/dashboard");
//     }
//   };
//   useSpeechRecognition(handleCommand);

//   return (
//     <div className="container mt-5">
//       <h1 className="text-center">Volunteer Service - Process Appointments</h1>
//       <ul className="nav nav-tabs">
//         {serviceTypes.map((service) => (
//           <li className="nav-item" key={service}>
//             <a
//               className={`nav-link ${activeTab === service ? "active" : ""}`}
//               onClick={() => setActiveTab(service)}
//               style={{ cursor: "pointer" }}
//             >
//               {service}
//             </a>
//           </li>
//         ))}
//       </ul>
//       <div className="tab-content mt-4">
//         {serviceTypes.map((service) => (
//           <div
//             key={service}
//             className={`tab-pane fade ${activeTab === service ? "show active" : ""}`}
//           >
//             {appointmentsByService[service] && appointmentsByService[service].length > 0 ? (
//               appointmentsByService[service].map((app) => (
//                 <div key={app.id} className="card mb-3">
//                   <div className="card-body">
//                     <h5 className="card-title">{app.name}</h5>
//                     <p className="card-text">
//                       <strong>Date:</strong> {app.date}
//                       <br />
//                       <strong>Time:</strong> {app.time}
//                       <br />
//                       <strong>Location:</strong> {app.location}
//                     </p>
//                     <button
//                       className="btn btn-primary mt-2"
//                       onClick={() =>
//                         navigate("/volunteerchat", { 
//                           state: { 
//                             appointmentId: app.id, 
//                             userName: app.name 
//                           } 
//                         })
//                       }
//                     >
//                       Chat for {app.name}
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No appointments found for {service}.</p>
//             )}
//           </div>
//         ))}
//       </div>
//       <button className="btn btn-secondary mt-4" onClick={() => navigate("/dashboard")}>
//         Back to Dashboard
//       </button>
//     </div>
//   );
// };

// export default VolunteerService;

import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
import "bootstrap/dist/css/bootstrap.min.css";

const VolunteerService = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("TechHelp");

  // Define the service types (task categories)
  const serviceTypes = ["TechHelp", "GroceryHelp", "AppointmentReminder", "Bingo"];

  // Fetch all appointments ordered by timestamp.
  useEffect(() => {
    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach((doc) => apps.push({ id: doc.id, ...doc.data() }));
      setAppointments(apps);
    });
    return () => unsubscribe();
  }, []);

  // Group appointments by service type.
  const appointmentsByService = serviceTypes.reduce((acc, service) => {
    acc[service] = appointments.filter((app) => app.service === service);
    return acc;
  }, {});

  // Voice command: “back” returns to the dashboard.
  const handleCommand = (command) => {
    if (
      command.toLowerCase().includes("back") ||
      command.toLowerCase().includes("go back")
    ) {
      navigate("/dashboard");
    }
  };
  useSpeechRecognition(handleCommand);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Volunteer Service – Process Appointments</h1>
      <ul className="nav nav-tabs">
        {serviceTypes.map((service) => (
          <li className="nav-item" key={service}>
            <a
              className={`nav-link ${activeTab === service ? "active" : ""}`}
              onClick={() => setActiveTab(service)}
              style={{ cursor: "pointer" }}
            >
              {service}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content mt-4">
        {serviceTypes.map((service) => (
          <div
            key={service}
            className={`tab-pane fade ${activeTab === service ? "show active" : ""}`}
          >
            {appointmentsByService[service] && appointmentsByService[service].length > 0 ? (
              appointmentsByService[service].map((app) => (
                <div key={app.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{app.name}</h5>
                    <p className="card-text">
                      <strong>Date:</strong> {app.date}<br />
                      <strong>Time:</strong> {app.time}<br />
                      <strong>Location:</strong> {app.location}
                    </p>
                    {/*
                      It is assumed that each appointment document includes a 
                      `userId` field representing the ID of the user who booked the appointment.
                    */}
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() =>
                        navigate("/volunteerchat", {
                          state: { 
                            chatPartnerId: app.userId,  // Use the user's ID only.
                            chatPartnerName: app.name  // The user's name.
                          },
                        })
                      }
                    >
                      Chat with {app.name}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No appointments found for {service}.</p>
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default VolunteerService;
