"use client";

import { io, Socket } from "socket.io-client";
import { authService } from "../services/auth";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000";

let socket: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;

export function getChatSocket(): Socket | null {
  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connectPromise = null;
}

export async function connectChatSocket(): Promise<Socket> {
  if (socket?.connected) {
    return socket;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    const { token } = await authService.getSocketToken();

    const instance = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: { token },
      transports: ["websocket", "polling"],
    });

    await new Promise<void>((resolve, reject) => {
      instance.once("connect", () => resolve());
      instance.once("connect_error", (error) => reject(error));
      instance.connect();
    });

    socket = instance;
    return instance;
  })();

  try {
    return await connectPromise;
  } catch (error) {
    connectPromise = null;
    throw error;
  }
}
