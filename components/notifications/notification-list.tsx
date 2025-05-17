"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, MessageSquare, CreditCard, Star, Briefcase } from "lucide-react"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notification-actions"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  data: any
  createdAt: Date
}

interface NotificationListProps {
  initialNotifications: Notification[]
  initialPagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export function NotificationList({ initialNotifications, initialPagination }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loadMore = async () => {
    if (!pagination.hasMore || loading) return

    setLoading(true)
    try {
      const result = await getNotifications({ page: pagination.page + 1, limit: pagination.limit })
      setNotifications([...notifications, ...result.notifications])
      setPagination(result.pagination)
    } catch (error) {
      console.error("Error loading more notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "JOB_CREATED":
        return <Briefcase className="h-5 w-5 text-blue-500" />
      case "OFFER_RECEIVED":
      case "OFFER_ACCEPTED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "MESSAGE_RECEIVED":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "PAYMENT_RECEIVED":
      case "PAYMENT_RELEASED":
        return <CreditCard className="h-5 w-5 text-emerald-500" />
      case "REVIEW_RECEIVED":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationLink = (notification: Notification) => {
    const { type, data } = notification

    if (!data) return "#"

    switch (type) {
      case "JOB_CREATED":
        return `/job/${data.jobId}`
      case "OFFER_RECEIVED":
        return `/client/job/${data.jobId}`
      case "OFFER_ACCEPTED":
        return `/craftsman/job/${data.jobId}`
      case "MESSAGE_RECEIVED":
        return `/chat/${data.jobId}`
      case "PAYMENT_RECEIVED":
      case "PAYMENT_RELEASED":
        return `/payment/${data.paymentId}`
      case "REVIEW_RECEIVED":
        return `/review/${data.reviewId}`
      default:
        return "#"
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some((notification) => !notification.isRead) && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-gray-500 mt-1">You don't have any notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                            Mark as read
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={getNotificationLink(notification)}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pagination.hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
