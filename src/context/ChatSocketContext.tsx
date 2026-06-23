"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import {
  connectChatSocket,
  disconnectChatSocket,
  getChatSocket,
} from "../lib/chatSocket";

interface ChatSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const ChatSocketContext = createContext<ChatSocketContextValue>({
  socket: null,
  isConnected: false,
  error: null,
});

interface ChatSocketProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function ChatSocketProvider({
  children,
  enabled = true,
}: ChatSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      disconnectChatSocket();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    let active = true;
    let instance: Socket | null = null;

    const handleConnect = () => {
      if (active) setIsConnected(true);
    };

    const handleDisconnect = () => {
      if (active) setIsConnected(false);
    };

    connectChatSocket()
      .then((connectedSocket) => {
        if (!active) return;

        instance = connectedSocket;
        setSocket(connectedSocket);
        setIsConnected(connectedSocket.connected);
        setError(null);

        connectedSocket.on("connect", handleConnect);
        connectedSocket.on("disconnect", handleDisconnect);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "فشل الاتصال بالمحادثات",
        );
      });

    return () => {
      active = false;
      if (instance) {
        instance.off("connect", handleConnect);
        instance.off("disconnect", handleDisconnect);
      }
      disconnectChatSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, [enabled]);

  const value = useMemo(
    () => ({
      socket: socket ?? getChatSocket(),
      isConnected,
      error,
    }),
    [socket, isConnected, error],
  );

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  return useContext(ChatSocketContext);
}
