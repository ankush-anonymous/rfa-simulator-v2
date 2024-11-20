import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { generateCircuit } from "../util/CircuitGeneratorClient";

const ChatInterface = ({ onBotResponse }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const storedChats = [];
    let index = 1;
    let chat = localStorage.getItem(`chat${index}`);
    while (chat) {
      storedChats.push({ id: `chat${index}`, role: "bot", content: chat });
      index++;
      chat = localStorage.getItem(`chat${index}`);
    }
    setChatHistory(storedChats);
  }, []);

  // Function to handle sending a message
  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user's message to history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { id: `chat${prevHistory.length + 1}`, role: "user", content: message },
    ]);

    try {
      const response = await generateCircuit({ userInput: message });

      // Generate new unique chat ID and save bot response to localStorage
      const newChatId = `chat${chatHistory.length + 1}`;
      localStorage.setItem(newChatId, response);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { id: newChatId, role: "bot", content: response },
      ]);

      // Pass bot response to Sidebar
      onBotResponse(response);
    } catch (error) {
      console.error("Error generating circuit:", error.message);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: `chat${chatHistory.length + 1}`,
          role: "bot",
          content: "An error occurred while generating the circuit.",
        },
      ]);
    }

    setMessage("");
  };

  // Function to extract and upload circuit JSON from a bot response
  const handleUploadCircuit = (chatId) => {
    // Check if the chat exists in localStorage
    const chatData = localStorage.getItem(chatId);
    console.log(chatData);

    if (chatData) {
      try {
        // Parse the chat data if it's in JSON format
        const circuitData = JSON.parse(chatData);
        // Pass the parsed data to the parent component via onBotResponse
        onBotResponse(circuitData);
      } catch (error) {
        console.error("Error parsing circuit data:", error.message);
      }
    } else {
      alert(`No chat data found for ${chatId}`);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
        padding: 1,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Circuit Chat
        </Typography>
      </Box>

      <Divider sx={{ marginBottom: 1 }} />

      {/* Chat History */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ffffff",
          padding: 1,
          borderRadius: 1,
          boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
          marginBottom: 1,
        }}
      >
        {chatHistory.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              alignItems: "center",
              gap: 1,
              marginBottom: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: msg.role === "user" ? "#1a73e8" : "#555",
                flex: 1,
              }}
            >
              <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong>{" "}
              {msg.content}
            </Typography>
            {msg.role === "bot" && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleUploadCircuit(msg.id)} // Pass chat ID to the handler
              >
                <CloudUploadIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <TextField
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        size="small"
        fullWidth
        multiline
        rows={2}
        sx={{
          marginBottom: 1,
          "& .MuiOutlinedInput-root": {
            fontSize: "0.85rem",
          },
        }}
      />

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={!message.trim()}
          sx={{ flex: 1 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
