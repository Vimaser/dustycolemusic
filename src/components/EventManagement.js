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
      const db = getFirestore(app);
      const eventsCollection = collection(db, "Events");
      const eventSnapshot = await getDocs(eventsCollection);
      let eventsList = eventSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      eventsList.sort((a, b) => {
        const dateA = a.eventDate?.toDate ? a.eventDate.toDate() : new Date();
        const dateB = b.eventDate?.toDate ? b.eventDate.toDate() : new Date();
        return dateA.getTime() - dateB.getTime();
      });

      setEvents(eventsList);
    };

    fetchEvents();
  }, [setEvents]); // Dependency array includes setEvents

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

      // fetchEvents();
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
