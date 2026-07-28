import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../config/api";
import { createContext, useEffect, useContext, useState } from "react";

const socket = io(BASE_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Socket Connected
    const handleConnect = () => {
      console.log("✅ Socket Connected");
      console.log("Socket ID :", socket.id);

      setIsConnected(true);
    };

    // Socket Disconnected
    const handleDisconnect = () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // ==========================
  // Initialize Socket
  // ==========================
  const initializeSocket = (userId) => {
    if (!userId) return;

    // Already connected
    if (socket.connected) {
      console.log("Socket already connected");

      socket.emit("register-user", userId);

      return;
    }

    console.log("Connecting socket...");

    socket.connect();

    socket.once("connect", () => {
      console.log("Registering User :", userId);

      socket.emit("register-user", userId);
    });
  };

  // Disconnect Socket
  const disconnectSocket = () => {
    if (!socket.connected) return;

    socket.disconnect();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        initializeSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
