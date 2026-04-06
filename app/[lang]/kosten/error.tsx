"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"

export default function KostenError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200">Fehler</h1>
      <h2 className="text-2xl font-bold mt-4">Kostenübersicht nicht verfügbar</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Die Kostenübersicht konnte leider nicht geladen werden. Bitte versuchen Sie es erneut.
      </p>
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Erneut versuchen
        </Button>
        <Button asChild>
          <Link href="/de/kosten">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Alle Kostenübersichten
          </Link>
        </Button>
      </div>
    </div>
  )
}
