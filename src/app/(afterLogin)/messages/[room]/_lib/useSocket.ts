import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null;

export default function useSocket(): [Socket | null, () => void] {
  const { data: session } = useSession();
  const disconnect = useCallback(() => {
    socket?.disconnect();
    socket = null;
  }, []);

  useEffect(() => {
    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/messages`, {
        transports: ["websocket"],
      });

      socket.on("connect_error", (err) => {
        console.log(err);
        console.log(`connect_error due to ${err.message}`);
      });
    }
  }, [session]);

  useEffect(() => {
    if (socket?.connected && session?.user?.email) {
      socket?.emit("login", { id: session?.user?.email });
    }
  }, [session]);

  return [socket, disconnect];
}
