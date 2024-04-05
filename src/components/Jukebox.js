import React, { useState } from "react";
import "./css/Jukebox.css";

function Jukebox() {
  const [nowPlaying, setNowPlaying] = useState("None");
  const songs = [
    { title: "Song 1", file: "song1.mp3" },
    { title: "Song 2", file: "song2.mp3" },
    // Add more songs as needed
  ];

  const selectSong = (song) => {
    setNowPlaying(song.title);
    // Add logic to play the song
  };

  return (
    <div className="jukebox">
      <div className="jukebox-top">
        <div className="chrome-element"></div>
        <div className="title">Jukebox</div>
        <div className="music-display">Now Playing: {nowPlaying}</div>
        <div className="chrome-element"></div>
      </div>
      <div className="jukebox-middle">
        <ul className="song-list">
          {songs.map((song, index) => (
            <li key={index} className="song" onClick={() => selectSong(song)}>
              {song.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="jukebox-bottom">
        <button className="play-button">Play</button>
      </div>
    </div>
  );
}

export default Jukebox;
