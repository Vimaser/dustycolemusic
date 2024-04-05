import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../firebase";
import "./css/Admin.css";
import { useEvents } from './contexts/EventsContext';

const EventManagement = () => {
  const { events, setEvents, handleDeleteEvent } = useEvents();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventEndingTime, setEventEndingTime] = useState("");
  const [location, setLocation] = useState("");
  
  

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const db = getFirestore(app);
    const eventsCollection = collection(db, "Events");
    const eventSnapshot = await getDocs(eventsCollection);
    let eventsList = eventSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  
    // Sort the events list by date
    eventsList.sort((a, b) => {
      const dateA = a.eventDate?.toDate ? a.eventDate.toDate() : new Date();
      const dateB = b.eventDate?.toDate ? b.eventDate.toDate() : new Date();
      return dateA.getTime() - dateB.getTime();
    });
  
    setEvents(eventsList);
  };
  

  const handleAddEvent = async () => {
    try {
      const db = getFirestore(app);
      const eventsCollection = collection(db, "Events");
      const dateWithCorrectTimeZone = new Date(eventDate + "T12:00:00");
      await addDoc(eventsCollection, {
        eventName,
        eventDate: dateWithCorrectTimeZone,
        location,
        eventTime,
        eventEndingTime,
      });

      setEventName("");
      setEventDate("");
      setLocation("");
      setEventTime("");
      setEventEndingTime("");

      fetchEvents();
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

/*   const handleDeleteEvent = async (id) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "Events", id));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  }; */

/*   function toStandardTime(militaryTime) {
    if (!militaryTime) {
      return "Time not set";
    }
    const [hours, minutes] = militaryTime.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const standardHours = ((hoursInt + 11) % 12) + 1;
    return `${standardHours.toString().padStart(2, "0")}:${minutes} ${suffix}`;
  } */

  return (
    <div>
      {/* Event Form */}
      <h2>Event Management:</h2>
      <section className="section">
        <br />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent();
          }}
        >
          <div>
            <label>
              Event Name:
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Event Date:
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Event Starting Time:
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Event Ending Time:
              <input
                type="time"
                value={eventEndingTime}
                onChange={(e) => setEventEndingTime(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Location:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Add Event</button>
        </form>
      </section>
{/*       <section>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.eventName}</h3>
            <p>{event.eventDate?.toDate()?.toLocaleDateString()}</p>
            <p>Starting Time: </p>
            <p>
              {event.eventTime
                ? toStandardTime(event.eventTime)
                : "Time not set"}
            </p>
            <p>Ending Time:</p>
            <p>
              {event.eventEndingTime
                ? toStandardTime(event.eventEndingTime)
                : "Time not set"}
            </p>
            <p>{event.location}</p>
            <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
          </div>
        ))}
      </section> */}
    </div>
  );
};

export default EventManagement;
