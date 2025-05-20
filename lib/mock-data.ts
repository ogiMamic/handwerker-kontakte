export interface MockJob {
    id: string
    title: string
    description: string
    category: string
    budget: number
    deadline: Date
    location: string
    clientId: string
    clientName: string
    status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
    createdAt: Date
  }
  
  export function getMockJobs(): MockJob[] {
    return [
      {
        id: "1",
        title: "Badezimmer renovieren",
        description: "Komplette Renovierung eines Badezimmers inklusive Fliesen und Sanitäranlagen",
        category: "Sanitär",
        budget: 5000,
        deadline: new Date(2023, 11, 15),
        location: "Berlin",
        clientId: "client1",
        clientName: "Max Mustermann",
        status: "OPEN",
        createdAt: new Date(2023, 9, 1),
      },
      {
        id: "2",
        title: "Küche installieren",
        description: "Installation einer neuen Küche mit Elektrogeräten",
        category: "Küchenbau",
        budget: 3500,
        deadline: new Date(2023, 10, 30),
        location: "München",
        clientId: "client2",
        clientName: "Anna Schmidt",
        status: "OPEN",
        createdAt: new Date(2023, 9, 5),
      },
      {
        id: "3",
        title: "Dach reparieren",
        description: "Reparatur eines undichten Daches nach Sturmschaden",
        category: "Dachdecker",
        budget: 2000,
        deadline: new Date(2023, 10, 10),
        location: "Hamburg",
        clientId: "client3",
        clientName: "Thomas Weber",
        status: "OPEN",
        createdAt: new Date(2023, 9, 10),
      },
      {
        id: "4",
        title: "Wände streichen",
        description: "Streichen aller Wände in einer 3-Zimmer-Wohnung",
        category: "Maler",
        budget: 1200,
        deadline: new Date(2023, 10, 20),
        location: "Köln",
        clientId: "client4",
        clientName: "Laura Müller",
        status: "OPEN",
        createdAt: new Date(2023, 9, 15),
      },
      {
        id: "5",
        title: "Elektroinstallation prüfen",
        description: "Überprüfung und Reparatur der Elektroinstallation in einem Altbau",
        category: "Elektriker",
        budget: 800,
        deadline: new Date(2023, 10, 25),
        location: "Frankfurt",
        clientId: "client5",
        clientName: "Michael Schneider",
        status: "OPEN",
        createdAt: new Date(2023, 9, 20),
      },
      {
        id: "6",
        title: "Garten neu anlegen",
        description: "Komplette Neugestaltung eines 200m² großen Gartens",
        category: "Gartenbau",
        budget: 4500,
        deadline: new Date(2023, 11, 30),
        location: "Stuttgart",
        clientId: "client6",
        clientName: "Sophie Wagner",
        status: "OPEN",
        createdAt: new Date(2023, 9, 25),
      },
    ]
  }
  