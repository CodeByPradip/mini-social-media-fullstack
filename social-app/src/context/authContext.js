import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { saveToken } from "../storage/authStorage/saveToken";
import { getToken } from "../storage/authStorage/getToken";
import { Alert } from "react-native";
import { removeToken } from "../storage/authStorage/removeToken";
import { BASE_URL } from "../config/api";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadUserLoding, setLoadUserLoding] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    setLoadUserLoding(true);

    try {
      const token = await getToken("token");

      if (!token) {
        setLoadUserLoding(false);
        return;
      }
      const response = await axios.get(`${BASE_URL}/api/auth/get-me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response?.data?.user);
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoadUserLoding(false);
    }
  };

  // register user
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newToken = res?.data?.token;

      await saveToken("token", newToken);
      setToken(newToken);
      await getCurrentUser();

      return res?.data?.user;
    } catch (error) {
      console.log(error.response?.data);
      setError(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // login user
  const loginUser = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          usernameOrEmail,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const newToken = response?.data?.token;

      await saveToken("token", newToken);
      setToken(newToken);
      await getCurrentUser();

      return response;
    } catch (error) {
      console.log(error?.response?.data);
      Alert.alert(error?.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  // getMessages
  const getMessages = async (friendId) => {
    try {
      const token = await getToken("token");
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/api/messages/get-messages/${friendId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const message = response?.data?.messages;
      return message
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  // logout user
  const logoutUser = async () => {
    try {
      const token = await getToken("token");
      if (!token) return;
      const response = await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser(null);
      await removeToken("token");
      setToken(null);
      return response?.data?.message;
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  // ======================
  // Update Password
  // =======================
  // /api/auth/change-password
  const updatePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    if (!oldPassword || !newPassword) {
      Alert.alert("Error", "Something went wrong");
      setLoading(false);
      return;
    }

    try {
      const token = await getToken("token");
      if (!token) {
        Alert.alert("invalid token");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatePassword = response?.data;
      await getCurrentUser();
      Alert.alert("update password", updatePassword?.messaga);
      return updatePassword;
    } catch (error) {
      Alert.alert(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        loading,
        error,
        registerUser,
        logoutUser,
        loginUser,
        updatePassword,
        loadUserLoding,
        getMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
