import React, { useState } from "react";
import { useMusic } from "../components/contexts/MusicContext";

const MusicManagement = () => {
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [musicURL, setMusicURL] = useState("");
  const [musicReleaseDate, setMusicReleaseDate] = useState("");
  const { handleMusicUpload } = useMusic();

  // const { music, handleMusicUpload, handleDeleteMusic } = useMusic();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMusicUpload(musicTitle, musicArtist, musicURL, musicReleaseDate);
    // Reset form fields
    setMusicTitle("");
    setMusicArtist("");
    setMusicURL("");
    setMusicReleaseDate("");
  };

  return (
    <section className="section">
      <h2>Music Management</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Music Title:
            <input
              type="text"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Music Artist:
            <input
              type="text"
              value={musicArtist}
              onChange={(e) => setMusicArtist(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Release Date:
            <input
              type="date"
              value={musicReleaseDate}
              onChange={(e) => setMusicReleaseDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Music URL:
            <p>Use an embedded URL to display an iframe.</p>
            <input
              type="text"
              value={musicURL}
              onChange={(e) => setMusicURL(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add Music</button>
      </form>

{/*       <div>
        {music.map((musicItem) => (
          <div key={musicItem.id}>
            <h3>{musicItem.title}</h3>
            <p>{musicItem.artist}</p>
            {musicItem.url && (
              <div
                className="iframe-container"
                dangerouslySetInnerHTML={{ __html: musicItem.url }}
              />
            )}
            <button onClick={() => handleDeleteMusic(musicItem.id)}>
              Delete
            </button>
          </div>
        ))}
      </div> */}
    </section>
  );
};

export default MusicManagement;
