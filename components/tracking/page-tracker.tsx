'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    const controller = new AbortController()
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || '',
      }),
      signal: controller.signal,
    }).catch(() => {})

    return () => controller.abort()
  }, [pathname])

  return null
}
