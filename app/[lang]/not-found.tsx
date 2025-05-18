import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold mt-4">Seite nicht gefunden</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Die von Ihnen gesuchte Seite existiert nicht oder wurde möglicherweise verschoben.
      </p>
      <Button asChild className="mt-8">
        <Link href="/de">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Startseite
        </Link>
      </Button>
    </div>
  )
}
