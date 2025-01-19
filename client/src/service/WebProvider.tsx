import { asyncStorage } from "@/store/storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SOCKET_URL } from "./config";
import { refresh_tokens } from "./apiInterceptor";
import { io, Socket } from "socket.io-client";

interface WSService {
  initializeSocket: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
  removeListener: (listenerName: string) => void;
  updateAccessToken: () => void;
  disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketAccessToken, setSocketAccessToken] = useState<string | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const initializeToken = async () => {
      const token = await asyncStorage.getItem("access_token"); // Handle async properly
      setSocketAccessToken(token);
    };
    initializeToken();
  }, []);

  useEffect(() => {
    if (socketAccessToken) {
      // Disconnect existing socket if it exists
      if (socket.current) {
        socket.current.disconnect();
      }

      // Initialize new socket connection
      socket.current = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
        extraHeaders: {
          access_token: socketAccessToken || "",
        },
      });

      socket.current.on("connect_error", (error) => {
        if (error.message === "Authentication error") {
          console.log("Auth connection error", error.message);
          refresh_tokens();
        }
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [socketAccessToken]);

  const emit = (event: string, data?: any) => {
    socket.current?.emit(event, data);
  };

  const on = (event: string, cb: (data: any) => void) => {
    socket.current?.on(event, cb);
  };

  const off = (event: string) => {
    socket.current?.off(event);
  };

  const removeListener = (listenerName: string) => {
    socket.current?.removeListener(listenerName);
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
  };

  const updateAccessToken = async () => {
    const token = await asyncStorage.getItem("access_token");
    setSocketAccessToken(token);
  };

  const socketService: WSService = {
    initializeSocket: () => {
      console.log("Socket initialized");
    },
    emit,
    on,
    off,
    removeListener,
    updateAccessToken,
    disconnect,
  };

  return (
    <WSContext.Provider value={socketService}>
      {children}
    </WSContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return context;
};
