import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import img1 from "../img/youngOutlaw.png";
import "./css/Music.css";
import MusicManagement from "./MusicManagement";
import { useMusic } from "../components/contexts/MusicContext";

const Music = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { music, handleDeleteMusic } = useMusic();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleMusicDeletion = (id) => {
    handleDeleteMusic(id, () => {
  
    });
  };

  return (
    <div className="music-background">
      <section>{isUserLoggedIn && <MusicManagement />}</section>
      <div className="music-container">
        <section>
          <h1>Music</h1>
        </section>
        {music.map((musicItem) => (
          <div key={musicItem.id} className="music-item">
            <h2>{musicItem.title}</h2>
            <p>
              Release Date:{" "}
              {musicItem.releaseDate
                ? new Date(musicItem.releaseDate.seconds * 1000).toLocaleDateString()
                : "Not Available"}
            </p>
            {isUserLoggedIn && (
              <button onClick={() => handleMusicDeletion(musicItem.id)}>
                Delete
              </button>
            )}
            {musicItem.url && musicItem.url.startsWith("<iframe") ? (
              <div
                className="iframe-container"
                dangerouslySetInnerHTML={{ __html: musicItem.url }}
              />
            ) : (
              <a href={musicItem.url} target="_blank" rel="noopener noreferrer">
                Listen Here
              </a>
            )}
          </div>
        ))}
      </div>
      <br />
      <section className="image-section image-section-spin">
        <img src={img1} alt="" />
      </section>
      <br />
    </div>
  );
};

export default Music;
