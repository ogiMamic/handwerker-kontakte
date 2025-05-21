import { Dashboard } from "@/components/dashboard/dashboard"
import { getDictionary } from "@/lib/dictionaries"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"

// Mock data for demonstration
const mockJobs = [
  {
    id: "1",
    title: "Badezimmer renovieren",
    category: "Renovierung",
    description: "Komplette Renovierung eines Badezimmers inklusive Fliesen und Sanitärinstallation.",
    budget: 5000,
    deadline: new Date(2024, 6, 15),
    status: "OPEN",
    offerCount: 3,
    createdAt: new Date(2024, 5, 1),
  },
  {
    id: "2",
    title: "Küche montieren",
    category: "Installation",
    description: "Montage einer neuen IKEA-Küche mit Elektrogeräten.",
    budget: 1200,
    deadline: new Date(2024, 5, 20),
    status: "IN_PROGRESS",
    offerCount: 2,
    createdAt: new Date(2024, 4, 15),
  },
]

const mockOffers = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Badezimmer renovieren",
    craftsmanId: "c1",
    craftsmanName: "Max Mustermann",
    companyName: "Mustermann GmbH",
    amount: 4800,
    hourlyRate: 45,
    description:
      "Ich biete Ihnen eine komplette Renovierung Ihres Badezimmers an. Inklusive aller Materialien und Arbeiten.",
    estimatedDuration: 10,
    status: "PENDING",
    createdAt: new Date(2024, 5, 2),
    category: "Renovierung",
    postalCode: "10115",
    city: "Berlin",
  },
  {
    id: "2",
    jobId: "2",
    jobTitle: "Küche montieren",
    craftsmanId: "c2",
    craftsmanName: "Anna Schmidt",
    companyName: "Schmidt & Partner",
    amount: 1100,
    hourlyRate: 40,
    description: "Professionelle Montage Ihrer IKEA-Küche mit allen Elektrogeräten.",
    estimatedDuration: 2,
    status: "ACCEPTED",
    createdAt: new Date(2024, 4, 16),
    category: "Installation",
    postalCode: "10115",
    city: "Berlin",
  },
]

const mockMetrics = {
  totalJobs: 5,
  openJobs: 3,
  totalOffers: 8,
  pendingOffers: 4,
  completedJobs: 2,
  acceptedOffers: 3,
}

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const { userId } = auth()

  if (!userId) {
    redirect(`/${lang}/sign-in`)
  }

  const dictionary = await getDictionary(lang)

  // Mock user data
  const user = {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
    type: "user",
    role: "both", // "client", "craftsman", or "both"
    currentRole: "client",
  }

  // Mock craftsman profile
  const craftsmanProfile = null

  return (
    <Dashboard
      user={user}
      jobs={mockJobs}
      offers={mockOffers}
      craftsmanProfile={craftsmanProfile}
      craftsmanJobs={[]}
      craftsmanOffers={[]}
      metrics={mockMetrics}
      lang={lang}
      dictionary={dictionary}
    />
  )
}
