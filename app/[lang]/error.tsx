"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-200">500</h1>
      <h2 className="text-3xl font-bold mt-4">Ein Fehler ist aufgetreten</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Entschuldigung, es ist ein unerwarteter Fehler aufgetreten. Unser Team wurde benachrichtigt.
      </p>
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Erneut versuchen
        </Button>
        <Button asChild>
          <Link href="/de">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>
      </div>
    </div>
  )
}
