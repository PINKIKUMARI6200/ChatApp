import React, { useState } from "react";
import useConversation from "../zustand/useConversation.js";
import axios from "axios";
import { useSocketContext } from "./SocketContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();
  const { socket } = useSocketContext();

  const sendMessages = async (message) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        { message }
      );

      // Update sender's UI instantly
      setMessage((prev) => [...prev, res.data]);

      // Emit to receiver
      socket.emit("sendMessage", res.data);

      setLoading(false);
    } catch (error) {
      console.log("Error in send messages", error);
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
