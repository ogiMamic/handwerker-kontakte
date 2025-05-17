"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUploader } from "@/components/shared/file-uploader"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  attachments?: string[]
  createdAt: Date
}

interface JobDetails {
  id: string
  title: string
  description: string
  budget: number
  deadline: Date
  status: string
  clientId: string
  clientName: string
  craftsmanId?: string
  craftsmanName?: string
}

export function ChatInterface({ jobId }: { jobId: string }) {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch job details and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch the job details and messages from your API
        // For this example, we'll use mock data

        // Mock job details
        setJobDetails({
          id: jobId,
          title: "Bathroom Renovation",
          description: "Complete renovation of a bathroom including new fixtures and tiling.",
          budget: 5000,
          deadline: new Date("2024-08-15"),
          status: "in_progress",
          clientId: "client123",
          clientName: "John Doe",
          craftsmanId: "craftsman456",
          craftsmanName: "Mike Smith",
        })

        // Mock messages
        const mockMessages: Message[] = [
          {
            id: "1",
            content: "Hello, I'm interested in your bathroom renovation project.",
            senderId: "craftsman456",
            senderName: "Mike Smith",
            createdAt: new Date("2024-05-10T10:00:00"),
          },
          {
            id: "2",
            content: "Great! Can you provide an estimate for the work?",
            senderId: "client123",
            senderName: "John Doe",
            createdAt: new Date("2024-05-10T10:05:00"),
          },
          {
            id: "3",
            content:
              "Based on your description, I estimate it will cost around €4,800 and take about 2 weeks to complete.",
            senderId: "craftsman456",
            senderName: "Mike Smith",
            createdAt: new Date("2024-05-10T10:10:00"),
          },
          {
            id: "4",
            content: "That sounds reasonable. When can you start?",
            senderId: "client123",
            senderName: "John Doe",
            createdAt: new Date("2024-05-10T10:15:00"),
          },
          {
            id: "5",
            content: "I can start next Monday. I'll need to order some materials first.",
            senderId: "craftsman456",
            senderName: "Mike Smith",
            createdAt: new Date("2024-05-10T10:20:00"),
          },
        ]

        setMessages(mockMessages)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [jobId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    setIsLoading(true)

    try {
      // In a real app, you would send the message to your API
      // For this example, we'll just add it to the local state
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: user?.id || "",
        senderName: user?.fullName || user?.username || "You",
        senderAvatar: user?.imageUrl,
        attachments: attachments.length > 0 ? [...attachments] : undefined,
        createdAt: new Date(),
      }

      setMessages([...messages, newMsg])
      setNewMessage("")
      setAttachments([])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (urls: string[]) => {
    setAttachments([...attachments, ...urls])
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "short",
    }).format(new Date(date))
  }

  if (!jobDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{jobDetails.title}</h1>
          <p className="text-gray-500">{jobDetails.status === "in_progress" ? "In Progress" : jobDetails.status}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Budget: €{jobDetails.budget}</p>
            <p className="text-sm text-gray-500">Deadline: {new Date(jobDetails.deadline).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="details">Job Details</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 border rounded-md mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex ${
                    message.senderId === user?.id ? "flex-row-reverse" : "flex-row"
                  } items-start gap-2 max-w-[80%]`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{message.senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.senderId === user?.id ? "You" : message.senderName}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {message.attachments.map((url, index) => (
                            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Attachment ${index + 1}`}
                                className="rounded border max-h-32 object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.senderId === user?.id ? "text-right" : "text-left"
                      }`}
                    >
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {attachments.length > 0 && (
            <div className="mb-2 p-2 border rounded-md">
              <div className="text-sm font-medium mb-1">Attachments:</div>
              <div className="flex gap-2 overflow-x-auto">
                {attachments.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Attachment ${index + 1}`}
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                    >
                      <span className="sr-only">Remove attachment</span>×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Message</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="files" className="mt-2">
                <FileUploader onUpload={handleFileUpload} maxFiles={5} />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm mt-1">{jobDetails.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Client</h3>
                  <p className="text-sm mt-1">{jobDetails.clientName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Craftsman</h3>
                  <p className="text-sm mt-1">{jobDetails.craftsmanName || "Not assigned"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Budget</h3>
                  <p className="text-sm mt-1">€{jobDetails.budget}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Deadline</h3>
                  <p className="text-sm mt-1">{new Date(jobDetails.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      jobDetails.status === "open"
                        ? "bg-blue-100 text-blue-800"
                        : jobDetails.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : jobDetails.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {jobDetails.status === "in_progress"
                      ? "In Progress"
                      : jobDetails.status.charAt(0).toUpperCase() + jobDetails.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
