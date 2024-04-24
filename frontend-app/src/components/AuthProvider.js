// context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (formData) => {
    const { fullname, email, password } = formData;
    const newUser = await axios.post("http://localhost:3000/users/register/", {
      fullname,
      email,
      password,
    });
    console.log(
      `New user ${newUser.fullname} registered successfully : ${JSON.stringify(
        newUser
      )}`
    );
    return newUser;
  };

  const login = async (email, password) => {
    const loggedInUserDetails = await axios.post(
      "http://localhost:3000/auth/signin/",
      {
        email,
        password,
      }
    );
    console.log(`loggedInUserDetails ${JSON.stringify(loggedInUserDetails)}`);
    const loggedInUser = loggedInUserDetails?.data?.user;
    setUser(loggedInUser);
    // Store the access token securely (e.g., in localStorage)
    localStorage.setItem("accessToken", loggedInUserDetails.data.access_token);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
