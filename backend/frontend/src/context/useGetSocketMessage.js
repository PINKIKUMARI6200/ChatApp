import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../zustand/useConversation.js";
import sound from "../assets/notification.mp3";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { setMessage } = useConversation(); // no need to grab messages

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const notification = new Audio(sound);
      notification.play();

      // Use functional update to always get latest messages
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessage]);
};

export default useGetSocketMessage;
