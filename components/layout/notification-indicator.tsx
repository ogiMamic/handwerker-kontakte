"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { getUnreadNotificationCount } from "@/lib/actions/notification-actions"

export function NotificationIndicator() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      const unreadCount = await getUnreadNotificationCount()
      setCount(unreadCount)
    }

    fetchCount()

    // Poll for new notifications every minute
    const interval = setInterval(fetchCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  )
}
