import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import loadingGif from "../img/loading2.gif";
import img from "../img/youngOutlaw.png";
import "./css/Events.css";
import EventManagement from "./EventManagement";
import { useEvents } from '../components/contexts/EventsContext';

const Events = () => {
  const { events, setEvents, handleDeleteEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });
    const fetchEvents = async () => {
      try {
        const db = getFirestore(app);
        const eventsCollection = collection(db, "Events");
        const eventSnapshot = await getDocs(eventsCollection);
        let eventsList = eventSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        eventsList.sort((a, b) => (a.eventDate ? a.eventDate.toDate().getTime() : 0) - (b.eventDate ? b.eventDate.toDate().getTime() : 0));
        setEvents(eventsList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();

    return () => unsubscribe();
  }, [setEvents]);

  if (isLoading) {
    return (
      <div className="events-background">
        <img src={loadingGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="events-background">
      <section>{isUserLoggedIn && <EventManagement />}</section>
      <section>
        <h1>Upcoming Events</h1>
      </section>
      <section>
        {events.length ? (
          events.map((event) => (
            <article key={event.id}>
              <h2>{event.eventName}</h2>
              <p>Date: {event.eventDate ? (event.eventDate instanceof Date ? event.eventDate.toLocaleDateString() : new Date(event.eventDate).toLocaleDateString()) : "Date not set"}</p>
              <p>Location: {event.location}</p>
              {isUserLoggedIn && (
                <button onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </button>
              )}
            </article>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>
      <br />
      <section className="image-section image-section-spin">
        <img src={img} alt="Dusty" />
      </section>
      <br />
    </div>
  );
};

export default Events;

