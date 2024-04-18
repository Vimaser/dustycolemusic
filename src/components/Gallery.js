import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";
import "./css/Gallery.css";
import GalleryManagement from "./GalleryManagement";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
      if (user) {
        fetchMedia();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchMedia = async () => {
    try {
      const storage = getStorage(app);
      const galleryRef = ref(storage, "gallery/");
      const result = await listAll(galleryRef);
      const urls = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const fileType = itemRef.name.split('.').pop();
          return { url, fileType, title: itemRef.name };
        })
      );

      setMediaItems(urls);
    } catch (error) {
      console.error("Error fetching media:", error);
      setError("Failed to fetch media.");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (item) => {
    setSelectedMedia(item);
    setModalShow(true);
  };

  const handleClose = () => {
    setModalShow(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gallery-container">
      <section>{isUserLoggedIn && <GalleryManagement />}</section>
      <section className="gallery-header">
        <h1>Gallery</h1>
      </section>
      <section className="gallery-content">
        {mediaItems.map((item, index) => (
          <div key={index} className="gallery-item" onClick={() => handleShow(item)}>
            {item.fileType === 'mp4' ? (
              <video controls src={item.url} alt={item.title || `Gallery item ${index + 1}`} />
            ) : (
              <img src={item.url} alt={item.title || `Gallery item ${index + 1}`} />
            )}
          </div>
        ))}
      </section>
      <Modal show={modalShow} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedMedia?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedia?.fileType === 'mp4' ? (
            <video controls autoPlay src={selectedMedia?.url} style={{ width: '100%' }} />
          ) : (
            <img src={selectedMedia?.url} alt={selectedMedia?.title} style={{ width: '100%' }} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Gallery;
