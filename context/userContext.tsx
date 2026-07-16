"use client";

interface User {
    username: string;
    age?: number;
    country?: string;
    favoriteGenre?: string;
    role?: string;
  }
  
  interface UserContextType {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    isUserLoading: boolean;
    setIsUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isAdmin: boolean;
    handleLogin: (token: string, userData: User) => void;
    handleLogout: () => void;
  }

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const NORMALIZED_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export const UserContext = createContext<UserContextType | undefined>(undefined);

/** Decodifica el payload de un JWT sin verificar la firma (solo lectura de claims). */
function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded?.role === "string" ? decoded.role : null;
  } catch {
    return null;
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);

  // Function to set JWT and user data
  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem("jwt", token); // Save JWT to localStorage
    setCurrentUser(userData); // Set user data in state
    setRole(userData.role ?? getRoleFromToken(token)); // Derive admin role
  };

  // Function to log out
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Remove JWT from localStorage
    setCurrentUser(null); // Clear user data
    setRole(null);
  };


  useEffect(() => {
    // Check if JWT exists in localStorage when the app loads
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsUserLoading(true);
      setRole(getRoleFromToken(token)); // Read role straight from the JWT
      axios
        .get(`${NORMALIZED_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCurrentUser(response.data);
          if (response.data?.role) setRole(response.data.role);
        })
        .catch((error) => {
          // Solo cerrar sesión si el token es realmente inválido/expirado (401).
          // Un fallo de red transitorio NO debe desloguear al usuario: antes,
          // cualquier error aquí borraba el JWT (ej. al navegar a favoritos).
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            handleLogout();
          }
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
        isAdmin: role === "admin",
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
