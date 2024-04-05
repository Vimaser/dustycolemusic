import React, { createContext, useState, useContext } from 'react';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase';

const EventsContext = createContext();

export const useEvents = () => useContext(EventsContext);

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const handleDeleteEvent = async (id) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'Events', id));
      
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <EventsContext.Provider value={{ events, setEvents, handleDeleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};
