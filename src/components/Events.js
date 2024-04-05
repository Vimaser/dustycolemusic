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

  function toStandardTime(militaryTime) {
    if (!militaryTime) {
      return "Time not set";
    }

    const [hours, minutes] = militaryTime.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const standardHours = ((hoursInt + 11) % 12) + 1;
    return `${standardHours.toString().padStart(2, "0")}:${minutes} ${suffix}`;
  }

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsUserLoggedIn(true);
        const db = getFirestore(app);
        const eventsCollection = collection(db, "Events");
        const eventSnapshot = await getDocs(eventsCollection);
        let eventsList = eventSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Updated sorting logic
        eventsList.sort((a, b) => {
          const dateA = a.eventDate?.toDate
            ? a.eventDate.toDate()
            : new Date(0);
          const dateB = b.eventDate?.toDate
            ? b.eventDate.toDate()
            : new Date(0);
          return dateA.getTime() - dateB.getTime();
        });

        setEvents(eventsList);
      } else {
        setIsUserLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setEvents]);

  if (isLoading) {
    return (
      <div className="events-background">
        <img src={loadingGif} alt="Loading..." />
        <br />
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
        <img src={img} alt="The Messanger" />
      </section>
      <br />
    </div>
  );
};

export default Events;
