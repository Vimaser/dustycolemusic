import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';

const GalleryManagement = () => {
  const [image, setImage] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [gallery, setGallery] = useState([]);
  const MAX_IMAGES = 20;

  useEffect(() => {
    const fetchGallery = async () => {
      const db = getFirestore(app);
      const galleryCollection = collection(db, "Gallery");
      const gallerySnapshot = await getDocs(galleryCollection);
      setGallery(gallerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchGallery();
  }, []);

  const handleImageUpload = async () => {
    if (gallery.length >= MAX_IMAGES) {
      alert(`You cannot upload more than ${MAX_IMAGES} images.`);
      return;
    }

    try {
      const storageRef = ref(getStorage(app), "gallery/" + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      const db = getFirestore(app);
      const galleryCollection = collection(db, "Gallery");
      const docRef = await addDoc(galleryCollection, {
        title: imageTitle,
        url: downloadURL,
      });

      setImage(null);
      setImageTitle("");

      setGallery((prevGallery) => [
        ...prevGallery,
        {
          id: docRef.id,
          title: imageTitle,
          url: downloadURL,
        },
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      console.log("Deleting image:", image);

      let fileName = image.fileName;
      if (!fileName) {
        console.warn(
          "Warning: image.fileName is undefined, extracting fileName from URL"
        );
        const urlParts = image.url.split("/");
        fileName = decodeURIComponent(
          urlParts[urlParts.length - 1].split("?")[0]
        );
      }

      const pathPrefix = "gallery/";
      if (!fileName.startsWith(pathPrefix)) {
        fileName = pathPrefix + fileName;
      }

      const storageRef = ref(getStorage(app), fileName);
      console.log("Full Path:", storageRef.fullPath);

      try {
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting from Firebase Storage:", error);
      }

      const db = getFirestore(app);
      await deleteDoc(doc(db, "Gallery", image.id));

      setGallery(gallery.filter((item) => item.id !== image.id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="gallery-container">
      <section className="section">
        <h2>Gallery Management</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImageUpload();
          }}
        >
          <div>
            <label>
              Image:
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
          <button type="submit">Upload Image</button>
        </form>
        <div>
          {gallery.map((image) => (
            <div key={image.id}>
              <h3>{image.title}</h3>
              <img src={image.url} alt={image.title} />
              <button onClick={() => handleDeleteImage(image)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GalleryManagement;
