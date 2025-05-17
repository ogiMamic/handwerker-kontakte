"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare, CheckCircle, XCircle } from "lucide-react"

interface Job {
  id: string
  title: string
  category: string
  description: string
  budget: number
  deadline: Date
  status: string
  offerCount: number
  createdAt: Date
}

interface Offer {
  id: string
  jobId: string
  jobTitle: string
  craftsmanId: string
  craftsmanName: string
  craftsmanImageUrl?: string
  companyName: string
  amount: number
  hourlyRate: number
  description: string
  estimatedDuration: number
  status: string
  createdAt: Date
}

interface ClientDashboardProps {
  jobs: Job[]
  offers: Offer[]
}

export function ClientDashboard({ jobs, offers }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("jobs")
  const router = useRouter()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Open
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            In Progress
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOfferStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Pending
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "WITHDRAWN":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Withdrawn
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <p className="text-gray-500">Manage your projects and offers</p>
        </div>
        <Button asChild>
          <Link href="/client/job-wizard">Create New Job</Link>
        </Button>
      </div>

      <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">My Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">No jobs yet</h3>
              <p className="text-gray-500 mt-2">Create your first job to get started</p>
              <Button className="mt-4" asChild>
                <Link href="/client/job-wizard">Create Job</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription className="capitalize">{job.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Posted: {formatDate(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center font-medium">
                        <span>Budget: €{job.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-sm text-gray-500">
                        {job.offerCount} {job.offerCount === 1 ? "offer" : "offers"}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/chat/${job.id}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/client/job/${job.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          {offers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">No offers yet</h3>
              <p className="text-gray-500 mt-2">You'll receive offers here when craftsmen respond to your jobs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.jobTitle}</CardTitle>
                        <CardDescription>Offer from {offer.companyName}</CardDescription>
                      </div>
                      {getOfferStatusBadge(offer.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={offer.craftsmanImageUrl || "/placeholder.svg"} />
                        <AvatarFallback>{offer.craftsmanName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{offer.craftsmanName}</div>
                        <div className="text-sm text-gray-500">Hourly rate: €{offer.hourlyRate}/hr</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm">{offer.description}</p>

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
                        <div>
                          <span className="font-medium">Offer amount:</span> €{offer.amount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Estimated duration:</span> {offer.estimatedDuration} days
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Received: {formatDate(offer.createdAt)}
                      </div>
                    </div>
                  </CardContent>

                  {offer.status === "PENDING" && (
                    <CardFooter className="pt-0">
                      <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
