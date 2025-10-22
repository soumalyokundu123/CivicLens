"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "update"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Issue Resolved",
    message: "Your reported pothole on Main Street has been successfully repaired.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: "/citizen",
  },
  {
    id: "2",
    type: "update",
    title: "Status Update",
    message: "Field worker has been assigned to your streetlight repair request.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionUrl: "/citizen",
  },
  {
    id: "3",
    type: "info",
    title: "New Feature",
    message: "You can now track your issues in real-time with our new map view.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Maintenance Notice",
    message: "System maintenance scheduled for tonight 11 PM - 2 AM EST.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
]

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "update":
        return <Clock className="h-4 w-4 text-accent" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return `${days}d ago`
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (for demo purposes)
      if (Math.random() < 0.1) {
        // 10% chance every 5 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "update",
          title: "New Update",
          message: "A field worker has started working on an issue in your area.",
          timestamp: new Date(),
          read: false,
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notification Dropdown */}
        {isOpen && (
          <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden shadow-lg z-50">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-accent/5" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>
                            <div className="flex items-center gap-1">
                              {!notification.read && <div className="w-2 h-2 bg-accent rounded-full"></div>}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All Notifications
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </>
  )
}
