"use client"

import React, { useState, useEffect, useRef } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from "react-markdown"
import { TextField, Button, Paper, Box, Typography } from "@mui/material"
import {
  Person as PersonIcon,
  SmartToy as RobotIcon
} from "@mui/icons-material"
import styles from "./Chatbot.module.css"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!)

const Chatbot = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chat, setChat] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 2.0,
        maxOutputTokens: 200,
        topP: 0.8,
        topK: 40,
        stopSequences: []
      }
    })
    const newChat = model.startChat()
    setChat(newChat)
  }, [])

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading])

  const sendMessage = async () => {
    if (!input || isLoading || !chat) return

    try {
      setIsLoading(true)
      setMessages((prev) => [...prev, `User: ${input}`])

      const result = await chat.sendMessage(input)
      const text = result.response.text()

      setMessages((prev) => [...prev, `AI: ${text}`])
      setInput("")
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setMessages((prev) => [
        ...prev,
        "AI: Sorry, I encountered an error. Please try again later."
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  return (
    <Paper elevation={3} className={styles.container}>
      <Box ref={messageContainerRef} className={styles.messageContainer}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            className={`${styles.message} ${
              msg.startsWith("User:") ? styles.userMessage : styles.aiMessage
            }`}
          >
            <Box
              className={`${styles.iconBubble} ${
                msg.startsWith("User:") ? styles.userIcon : styles.aiIcon
              }`}
            >
              {msg.startsWith("User:") ? (
                <PersonIcon sx={{ color: "white", fontSize: 18 }} />
              ) : (
                <RobotIcon sx={{ color: "white", fontSize: 18 }} />
              )}
            </Box>
            {msg.startsWith("User:") ? (
              <Typography sx={{ m: 0 }}>{msg.replace("User: ", "")}</Typography>
            ) : (
              <Typography
                component="div"
                sx={{
                  m: 0,
                  "& p": { m: 0 }
                }}
              >
                <ReactMarkdown>{msg.replace("AI: ", "")}</ReactMarkdown>
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Box className={styles.inputContainer}>
        <TextField
          inputRef={inputRef}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => void sendMessage()}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </Box>
    </Paper>
  )
}

export default Chatbot
