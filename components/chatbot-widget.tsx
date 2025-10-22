"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your CivicReport AI assistant. I can help you with reporting issues, tracking status, or answering questions about the platform.",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["How do I report an issue?", "Track my issues", "What types of issues can I report?"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const sendMessage = (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response with typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(messageText)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userInput: string): { text: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase()

    if (input.includes("report") || input.includes("issue")) {
      return {
        text: "To report an issue: 1) Click 'Report Issue' tab, 2) Fill out the form with details, 3) Add photos if possible, 4) Include your location using GPS, 5) Submit to get a tracking ID.",
        suggestions: ["What info should I include?", "Can I add multiple photos?", "How do I use GPS?"],
      }
    }

    if (input.includes("track") || input.includes("status")) {
      return {
        text: "You can track your issues in the 'View Status' tab. Each issue shows: • Current status (Pending/In Progress/Resolved) • AI classification • Date submitted • Location. You'll also receive notifications for updates!",
        suggestions: ["What do the statuses mean?", "How do I get notifications?", "View on map"],
      }
    }

    if (input.includes("how long") || input.includes("time")) {
      return {
        text: "Resolution times vary by issue type: • Public Safety: 1-2 days • Public Spaces: 2-3 days • Road Issues: 3-5 days • Infrastructure: 5-7 days • Utilities: 3-6 days. You'll receive updates throughout the process.",
        suggestions: ["Why do times vary?", "How do I get updates?", "What affects priority?"],
      }
    }

    if (input.includes("photo") || input.includes("image")) {
      return {
        text: "Photos are super helpful! Tips: • Take clear, well-lit photos • Show the full problem area • Include context (street signs, landmarks) • You can upload multiple images • Max 10MB per photo.",
        suggestions: ["What makes a good photo?", "How many photos can I add?", "Photo requirements"],
      }
    }

    if (input.includes("location") || input.includes("gps")) {
      return {
        text: "Location helps us find issues quickly! You can: • Use 'Get GPS' for automatic coordinates • Enter an address manually • Be as specific as possible • Include landmarks if helpful.",
        suggestions: ["GPS not working?", "Can I report without location?", "How accurate should I be?"],
      }
    }

    if (input.includes("map") || input.includes("view")) {
      return {
        text: "The Map View shows all issues in your area! Features: • Color-coded by status • Size indicates priority • Click markers for details • See your location • Filter by type.",
        suggestions: ["How do I use the map?", "What do colors mean?", "Can I filter issues?"],
      }
    }

    if (input.includes("notification") || input.includes("update")) {
      return {
        text: "Stay informed with notifications! You'll get alerts for: • Status changes • Worker assignments • Issue resolution • System updates. Check the bell icon in the header!",
        suggestions: ["How do I enable notifications?", "What updates will I get?", "Can I customize alerts?"],
      }
    }

    if (input.includes("types") || input.includes("categories")) {
      return {
        text: "You can report these issue types: • Road Issues (potholes, signs) • Infrastructure (streetlights, sidewalks) • Public Spaces (parks, graffiti) • Public Safety (traffic, hazards) • Utilities (water, power) • Other community concerns",
        suggestions: ["Which category for my issue?", "What if it doesn't fit?", "How are issues classified?"],
      }
    }

    if (input.includes("hello") || input.includes("hi") || input.includes("help")) {
      return {
        text: "Hi there! I'm here to help with CivicReport. I can assist with reporting issues, tracking progress, understanding the platform, or answering any questions you have.",
        suggestions: ["How do I report an issue?", "Track my issues", "Explain the map view"],
      }
    }

    return {
      text: "I'm here to help with CivicReport! I can assist with reporting issues, tracking status, using the map view, understanding notifications, or any other questions about the platform.",
      suggestions: ["Report an issue", "Track my issues", "Use the map", "Get notifications"],
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
          size="icon"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-[28rem] shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-t-lg">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="h-4 w-4" />
              CivicReport AI Assistant
              <Sparkles className="h-3 w-3 text-yellow-300" />
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-accent-foreground hover:bg-accent-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col flex-grow p-4 pt-0">
            {/* Messages */}
            <div className="flex-1 min-h-0 max-h-[17rem] overflow-y-auto space-y-3 mb-4 pt-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === "bot" && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                        {message.sender === "user" && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                        <span className="leading-relaxed">{message.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.sender === "bot" && message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-6">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2 bg-transparent"
                          onClick={() => sendMessage(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 text-sm"
                disabled={isTyping}
              />
              <Button onClick={() => sendMessage()} size="icon" className="h-9 w-9" disabled={isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
