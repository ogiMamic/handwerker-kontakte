import type { Job } from "@/lib/jobs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, EuroIcon } from "lucide-react"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const statusColors = {
    offen: "bg-green-100 text-green-800",
    vergeben: "bg-blue-100 text-blue-800",
    abgeschlossen: "bg-gray-100 text-gray-800",
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <Badge className={statusColors[job.status]}>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{job.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <EuroIcon className="h-4 w-4 text-muted-foreground" />
            <span>{job.budget}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Frist: {new Date(job.deadline).toLocaleDateString("de-DE")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline">{job.category}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Eingestellt am {new Date(job.postedAt).toLocaleDateString("de-DE")}
        </p>
      </CardFooter>
    </Card>
  )
}
