"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Limbi! 🌱 How can I help you turn your waste into worth today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getContextualResponse = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase()

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! I'm Limbi, your friendly assistant. How can I help you today? 🌱"
    }

    if (message.includes("app") || message.includes("application") || message.includes("platform")) {
      return "LimbahKu is a platform in Indonesia where you can sell recyclable waste like paper, plastic, metal, electronics, and more to verified collectors. It's easy to use and helps you earn money while keeping the environment clean! 🌍"
    }

    if (message.includes("sell") || message.includes("seller")) {
        return "To sell your waste on LimbahKu: 1) Register or login 2) Go to your dashboard and open the marketplace 3) Select the type of waste you want to sell 4) Input the weight (minimum applies per waste type) 5) Confirm the request and wait for buyer approval 6) After pickup, your balance will be updated. Need help starting?"
    }
    
    if (message.includes("register") || message.includes("sign up") || message.includes("account")) {
        return "You can register with Google or email. After signing up, choose your role (seller or buyer), and set your pickup/delivery address. It only takes a few minutes to get started!"
    }
    
    if (message.includes("login") || message.includes("sign in")) {
        return "You can login with your Google account or email and password. If you're new, just click Register to create a free account."
    }
    
    if (message.includes("pickup") || message.includes("collect")) {
        return "After your waste is approved by a buyer, a courier will come to your address to validate and collect the items. The waste will then be delivered to the buyer's warehouse safely."
    }
    
    if (message.includes("price") || message.includes("cost") || message.includes("money")) {
        return "Each waste type has a different market price. After your waste is picked up, your balance will be credited accordingly. You can withdraw your earnings at any time."
    }
    
    if (message.includes("type") || message.includes("waste")) {
        return "You can sell various waste types on LimbahKu, including: 📦 Paper, 🥤 Plastic, 🔧 Metal, 📱 E-waste, 🍃 Organic waste, 👕 Textile, 🧽 Rubber, 🧪 Glass, and 🛢️ Used cooking oil."
    }
    
    if (message.includes("collector") || message.includes("buyer") || message.includes("buy")) {
        return "Buyers can also register and login to request specific waste from sellers. After confirming a request, they’ll get matched and notified when a seller submits a transaction."
    }
    
    if (message.includes("location") || message.includes("area")) {
        return "LimbahKu currently operates across major cities in Indonesia. During registration, set your address so we can connect you with buyers or sellers nearby."
    }
      

    return null
  }

  const sendToGemini = async (message: string): Promise<string> => {
    try {
      const apiUrl = import.meta.env.VITE_GEMINI_URL

      if (!apiUrl) {
        throw new Error("Gemini API URL not configured")
      }

      console.log("Sending to Gemini API:", apiUrl)

      const contextPrompt = `You are LimbahKu's friendly assistant. LimbahKu is a platform in Indonesia where people can sell recyclable waste (paper, plastic, metal, electronics, cooking-oil, organic-waste, rubber, glass, textile.) to verified collectors.
                            Your Name is Limbi. Answer in english please.
                            User question: ${message}`

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: contextPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }

      console.log("Request body:", JSON.stringify(requestBody, null, 2))

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Gemini API response status:", response.status)
      console.log("Gemini API response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Gemini API response data:", data)

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        console.error("No text generated from API response:", data)
        throw new Error("No response generated")
      }

      return generatedText.trim()
    } catch (error) {
      console.error("Gemini API error:", error)
      return "I'm having trouble connecting right now. Please try again in a moment, or contact our support team for immediate assistance."
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      let botResponse = getContextualResponse(inputMessage.trim())

      if (!botResponse) {
        botResponse = await sendToGemini(inputMessage.trim())
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again!",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-[#7E8257] hover:bg-[#525837] shadow-lg hover:shadow-xl transition-all duration-300 z-50 p-0"
          aria-label="Open chat with LimbahKu assistant"
        >
          <img src="/Limbi.png" alt="LimbahKu Mascot" className="w-12 h-12 rounded-full object-cover" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl z-50 bg-white border-2 border-[#7E8257] flex flex-col max-h-[500px] p-0">
          <CardHeader className="bg-gradient-to-r from-[#525837] to-[#7E8257] text-white p-4 rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/Limbi.png" alt="LimbahKu Mascot" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <CardTitle className="text-sm font-cormorant">LimbahKu Assistant</CardTitle>
                  <p className="text-xs text-white/80">Always here to help! 🌱</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? "bg-[#525837] text-white"
                          : "bg-[#F1E6D0] text-[#525837] border border-[#7E8257]/20"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#F1E6D0] text-[#525837] border border-[#7E8257]/20 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#7E8257] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#7E8257] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#7E8257] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-[#7E8257]/20 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about LimbahKu..."
                    className="flex-1 border-[#7E8257]/30 focus:border-[#525837] focus:ring-[#525837]"
                    disabled={isLoading}
                    autoFocus={isOpen && !isMinimized}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#525837] hover:bg-[#7E8257] text-white px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • Always learning to help you better
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
