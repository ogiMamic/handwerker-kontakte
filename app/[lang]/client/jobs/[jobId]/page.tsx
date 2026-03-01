// @ts-nocheck
import { getJobById } from "@/lib/actions/job-actions"
import { JobDetailWithStats } from "@/components/client/job-detail-with-stats"
import { notFound } from "next/navigation"

interface JobDetailPageProps {
  params: {
    lang: string
    jobId: string
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  try {
    const job = await getJobById(params.jobId)

    return (
      <div className="container mx-auto py-8 px-4">
        <JobDetailWithStats job={job} />
      </div>
    )
  } catch (error) {
    console.error("Error loading job:", error)
    notFound()
  }
}
