import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../firebase";
import "./css/Admin.css";
import { useEvents } from './contexts/EventsContext';

const EventManagement = () => {
  const { setEvents } = useEvents();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventEndingTime, setEventEndingTime] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const db = getFirestore(app);
        const eventsCollection = collection(db, "Events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventsList = eventSnapshot.docs.map((doc) => {
          const eventData = doc.data();
          const eventDate = eventData.eventDate ? eventData.eventDate.toDate() : null;
          return {
            ...eventData,
            id: doc.id,
            eventDate: eventDate ? eventDate.toISOString().substring(0, 10) : "", // Format date as YYYY-MM-DD
          };
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [setEvents]);

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
      // Clear form fields after adding event
      setEventName("");
      setEventDate("");
      setLocation("");
      setEventTime("");
      setEventEndingTime("");
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default EventManagement;
