import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";

const Logout = () => {
  const handleLogout = async () => {
    try {
      const authInstance = getAuth(app);
      await signOut(authInstance);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
