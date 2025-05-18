// lib/actions/auftraege-actions.ts
"use server";

import { v4 as uuidv4 } from "uuid";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  postalCode: string;
  city: string;
  budget: number;
  deadline: Date;
  createdAt: Date;
}

interface GetJobsOptions {
  page?: number;
  kategorie?: string;
}

// Dummy data za poslove
const dummyJobs: Job[] = [
  {
    id: uuidv4(),
    title: "Badezimmer renovieren",
    category: "sanitaer",
    description: "Komplette Renovierung eines Badezimmers mit neuen Fliesen, Dusche und Waschbecken.",
    postalCode: "10115",
    city: "Berlin",
    budget: 5000,
    deadline: new Date("2024-08-15"),
    createdAt: new Date("2024-05-01"),
  },
  {
    id: uuidv4(),
    title: "Elektroinstallation für Neubau",
    category: "elektro",
    description: "Komplette Elektroinstallation für ein neues Einfamilienhaus.",
    postalCode: "80331",
    city: "München",
    budget: 8000,
    deadline: new Date("2024-09-20"),
    createdAt: new Date("2024-05-02"),
  },
  {
    id: uuidv4(),
    title: "Einbauschrank nach Maß",
    category: "tischlerei",
    description: "Einbauschrank für eine Nische im Schlafzimmer.",
    postalCode: "20095",
    city: "Hamburg",
    budget: 3000,
    deadline: new Date("2024-07-10"),
    createdAt: new Date("2024-05-03"),
  },
  {
    id: uuidv4(),
    title: "Wohnzimmer streichen",
    category: "malerei",
    description: "Wohnzimmer (30m²) neu streichen.",
    postalCode: "50667",
    city: "Köln",
    budget: 1200,
    deadline: new Date("2024-06-15"),
    createdAt: new Date("2024-05-04"),
  },
  {
    id: uuidv4(),
    title: "Parkett verlegen",
    category: "bodenbelag",
    description: "Parkett in Wohnzimmer und Flur verlegen (45m²).",
    postalCode: "60311",
    city: "Frankfurt",
    budget: 3500,
    deadline: new Date("2024-07-05"),
    createdAt: new Date("2024-05-05"),
  },
  {
    id: uuidv4(),
    title: "Dachrinne erneuern",
    category: "dach",
    description: "Dachrinnen an einem Einfamilienhaus erneuern.",
    postalCode: "70173",
    city: "Stuttgart",
    budget: 1800,
    deadline: new Date("2024-06-30"),
    createdAt: new Date("2024-05-06"),
  },
  {
    id: uuidv4(),
    title: "Gartenzaun errichten",
    category: "garten",
    description: "Neuen Gartenzaun (15m) errichten.",
    postalCode: "01067",
    city: "Dresden",
    budget: 2200,
    deadline: new Date("2024-07-15"),
    createdAt: new Date("2024-05-07"),
  },
  {
    id: uuidv4(),
    title: "Heizungsanlage warten",
    category: "sanitaer",
    description: "Jährliche Wartung der Heizungsanlage.",
    postalCode: "30159",
    city: "Hannover",
    budget: 300,
    deadline: new Date("2024-06-10"),
    createdAt: new Date("2024-05-08"),
  },
  {
    id: uuidv4(),
    title: "Lichtinstallation im Garten",
    category: "elektro",
    description: "Installation von Gartenbeleuchtung mit Bewegungsmeldern.",
    postalCode: "40213",
    city: "Düsseldorf",
    budget: 1500,
    deadline: new Date("2024-07-20"),
    createdAt: new Date("2024-05-09"),
  },
  {
    id: uuidv4(),
    title: "Küchenmöbel montieren",
    category: "tischlerei",
    description: "Montage einer neuen IKEA-Küche.",
    postalCode: "04109",
    city: "Leipzig",
    budget: 800,
    deadline: new Date("2024-06-25"),
    createdAt: new Date("2024-05-10"),
  },
];

export async function getJobs({ page = 1, kategorie = "alle" }: GetJobsOptions) {
  // Simulacija kašnjenja za realniji osećaj
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Filtriranje po kategoriji
  const filteredJobs = kategorie === "alle" 
    ? dummyJobs 
    : dummyJobs.filter(job => job.category === kategorie);
  
  // Paginacija
  const limit = 6;
  const total = filteredJobs.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  const paginatedJobs = filteredJobs.slice(offset, offset + limit);
  
  return {
    jobs: paginatedJobs,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    }
  };
}