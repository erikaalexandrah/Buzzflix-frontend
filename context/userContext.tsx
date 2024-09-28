"use client";

interface User {
    id: string;
    username: string;
    userCountry: string;
    userFavoriteGenre: string;
  }
  
  interface UserContextType {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    isUserLoading: boolean;
    setIsUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogin: (token: string, userData: User) => void;
    handleLogout: () => void;
  }
  
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  // Function to set JWT and user data
  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem("jwt", token); // Save JWT to localStorage
    setCurrentUser(userData); // Set user data in state
  };

  // Function to log out
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem("jwt"); // Remove JWT from localStorage
    setCurrentUser(null); // Clear user data
    console.log('JWT after logout:', localStorage.getItem("jwt")); // Should be null
  };
  

  useEffect(() => {
    // Check if JWT exists in localStorage when the app loads
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsUserLoading(true);
      axios
        .get("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCurrentUser(response.data);
        })
        .catch(() => {
          handleLogout(); // Clear the token if the request fails
        })
        .finally(() => {
          setIsUserLoading(false);
        });
    } else {
      setIsUserLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isUserLoading,
        setIsUserLoading,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserData(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
}
