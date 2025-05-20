import { Dashboard } from "@/components/dashboard/dashboard"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"

// Mock-Daten für die Entwicklung
const mockJobs = [
  {
    id: "1",
    title: "Badezimmer renovieren",
    category: "Renovierung",
    description: "Komplette Renovierung eines Badezimmers inklusive Fliesen und Sanitäranlagen.",
    budget: 5000,
    deadline: new Date(2023, 11, 15),
    status: "OPEN",
    offerCount: 3,
    createdAt: new Date(2023, 10, 1),
  },
  {
    id: "2",
    title: "Küche installieren",
    category: "Installation",
    description: "Installation einer neuen Küche mit Elektrogeräten.",
    budget: 3000,
    deadline: new Date(2023, 11, 20),
    status: "IN_PROGRESS",
    offerCount: 2,
    createdAt: new Date(2023, 10, 5),
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
      "Wir bieten Ihnen eine komplette Renovierung Ihres Badezimmers an. Inklusive aller Materialien und Arbeitsleistung.",
    estimatedDuration: 10,
    status: "PENDING",
    createdAt: new Date(2023, 10, 5),
  },
  {
    id: "2",
    jobId: "1",
    jobTitle: "Badezimmer renovieren",
    craftsmanId: "c2",
    craftsmanName: "Anna Schmidt",
    companyName: "Schmidt & Partner",
    amount: 5200,
    hourlyRate: 50,
    description:
      "Wir sind spezialisiert auf hochwertige Badezimmerrenovierungen und bieten Ihnen ein Komplettpaket an.",
    estimatedDuration: 8,
    status: "PENDING",
    createdAt: new Date(2023, 10, 6),
  },
]

const mockCraftsmanProfile = {
  id: "cp1",
  userId: "u1",
  companyName: "Meine Firma GmbH",
  contactPerson: "Max Mustermann",
  email: "max@meinefirma.de",
  phone: "0123456789",
  address: "Hauptstraße 1",
  postalCode: "12345",
  city: "Berlin",
  description: "Wir sind spezialisiert auf Renovierungen aller Art.",
  skills: ["Renovierung", "Installation", "Sanitär"],
  hourlyRate: 45,
  isVerified: true,
  completionPercentage: 85,
}

const mockMetrics = {
  totalJobs: 5,
  openJobs: 2,
  totalOffers: 8,
  pendingOffers: 3,
  completedJobs: 3,
  acceptedOffers: 5,
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

  // In einer echten Anwendung würden wir hier Daten aus der Datenbank laden
  // Für dieses Beispiel verwenden wir Mock-Daten
  const user = {
    id: userId,
    name: "Max Mustermann",
    email: "max@example.com",
    type: "CLIENT",
    role: "both" as const,
    currentRole: "client" as const,
  }

  return (
    <div className="container mx-auto py-8">
      <Dashboard
        user={user}
        jobs={mockJobs}
        offers={mockOffers}
        craftsmanProfile={mockCraftsmanProfile}
        craftsmanJobs={[]}
        craftsmanOffers={[]}
        metrics={mockMetrics}
        lang={lang}
      />
    </div>
  )
}
