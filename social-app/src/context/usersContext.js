import { createContext, useContext, useEffect, useState } from "react";
// import { users } from "../friends/database.users";
import axios from "axios";
import { getToken } from "../storage/authStorage/getToken";
import { BASE_URL } from "../config/api";

const UsersContext = createContext();

export const UsersContextProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingLoadUsers, setLoadingLoadUsers] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setLoadingLoadUsers(true);
    try {
      const token = await getToken("token");
      const response = await axios.get(`${BASE_URL}/api/user/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response) {
        return;
      }

      setAllUsers(response?.data?.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingLoadUsers(false);
    }
  };
  return (
    <UsersContext.Provider
      value={{ setAllUsers, allUsers, loadingLoadUsers, getAllUsers }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useAllUsers = () => useContext(UsersContext);
