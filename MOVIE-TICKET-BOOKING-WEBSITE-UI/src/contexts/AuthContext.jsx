import React, { createContext, useState, useEffect, useContext } from "react";
import cinemaApi from "../cinemaApi";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const signUp = async ({ name, email, password }) => {
    try {
      const response = await cinemaApi.post(
        "/users/register",
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      if (data) {
        console.log(data)
        localStorage.setItem("currentUser", JSON.stringify(data));
        setCurrentUser(data);
        return true;
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      return false;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const response = await cinemaApi.post(
        "/users/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      if (data) {
        localStorage.setItem("currentUser", JSON.stringify(data));
        setCurrentUser(data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Sign In Error:", error);
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};