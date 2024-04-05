import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { app } from "../../firebase";

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    const fetchMusic = async () => {
      const db = getFirestore(app);
      const musicCollection = collection(db, "Music");
      const musicSnapshot = await getDocs(musicCollection);
      setMusic(
        musicSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchMusic();
  }, []);


  const handleMusicUpload = async (title, artist, url, releaseDate) => {
    try {
      const db = getFirestore(app);
      const musicCollection = collection(db, "Music");
      const docRef = await addDoc(musicCollection, {
        title,
        artist,
        url,
        releaseDate: new Date(releaseDate),
      });
  
      const newMusicItem = {
        id: docRef.id,
        title,
        artist,
        url,
        releaseDate,
      };
  
      setMusic((currentList) => [...currentList, newMusicItem]);
    } catch (error) {
      console.error("Error uploading music:", error);
    }
  };
  
  

  const handleDeleteMusic = async (id, onDeleteSuccess) => {
    try {
      const db = getFirestore(app);
      const musicDocRef = doc(db, "Music", id);
      await deleteDoc(musicDocRef);
  
      // Update the local state to reflect the deletion
      setMusic(currentMusic => currentMusic.filter(musicItem => musicItem.id !== id));
  
      // Call the onDeleteSuccess callback
      onDeleteSuccess(id);
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  };
  
  

  const value = {
    music,
    setMusic,
    handleMusicUpload,
    handleDeleteMusic
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};
