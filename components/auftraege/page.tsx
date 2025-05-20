import { Suspense } from "react"
import { getJobs } from "@/lib/jobs"
import { JobCard } from "@/components/JobCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { auth as serverAuth } from "@clerk/nextjs/server"

export default async function AuftraegePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const { userId } = serverAuth() // Updated import

  if (!userId) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Finden Sie die besten Handwerker für Ihre Projekte</h1>
          <p className="text-xl mb-8">
            Melden Sie sich an, um auf alle verfügbaren Aufträge zuzugreifen und mit Handwerkern in Kontakt zu treten.
          </p>
          <SignInButton mode="modal" redirectUrl="/auftraege">
            <Button size="lg">Anmelden / Registrieren</Button>
          </SignInButton>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Verfügbare Aufträge</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Willkommen zurück</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <Suspense fallback={<JobsListSkeleton />}>
        <JobsList currentPage={currentPage} />
      </Suspense>
    </div>
  )
}

async function JobsList({ currentPage }: { currentPage: number }) {
  const { jobs, totalPages } = await getJobs(currentPage)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
          <a href={`/auftraege?page=${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </a>
        </Button>

        <div className="flex items-center px-4">
          <span className="text-sm">
            Seite {currentPage} von {totalPages}
          </span>
        </div>

        <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild>
          <a href={`/auftraege?page=${currentPage + 1}`}>
            Weiter
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      </div>
    </>
  )
}

function JobsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="h-64 animate-pulse">
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}
