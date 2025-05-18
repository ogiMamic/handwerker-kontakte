// lib/actions/handwerker-actions.ts
"use server";

import { v4 as uuidv4 } from "uuid";

interface Handwerker {
  id: string;
  name: string;
  companyName: string;
  imageUrl: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  postalCode: string;
  city: string;
  phone: string;
  website?: string;
}

interface SearchHandwerkerOptions {
  plz?: string;
  skill?: string;
  page?: number;
}

// Dummy data za majstore
const dummyHandwerker: Handwerker[] = [
  {
    id: uuidv4(),
    name: "Klaus Wagner",
    companyName: "Wagner Sanitär & Heizung GmbH",
    imageUrl: "/placeholder.svg?height=200&width=200&query=plumber",
    skills: ["sanitaer", "heizung"],
    rating: 4.8,
    reviewCount: 124,
    postalCode: "10115",
    city: "Berlin",
    phone: "+49 30 12345678",
    website: "https://wagner-sanitaer.example.de",
  },
  {
    id: uuidv4(),
    name: "Michael Schneider",
    companyName: "Schneider Elektrotechnik",
    imageUrl: "/placeholder.svg?height=200&width=200&query=electrician",
    skills: ["elektro", "smart-home"],
    rating: 4.6,
    reviewCount: 98,
    postalCode: "80331",
    city: "München",
    phone: "+49 89 87654321",
    website: "https://schneider-elektro.example.de",
  },
  {
    id: uuidv4(),
    name: "Frank Meyer",
    companyName: "Meyer Tischlerei",
    imageUrl: "/placeholder.svg?height=200&width=200&query=carpenter",
    skills: ["tischlerei", "möbel"],
    rating: 4.9,
    reviewCount: 156,
    postalCode: "20095",
    city: "Hamburg",
    phone: "+49 40 23456789",
    website: "https://meyer-tischlerei.example.de",
  },
  {
    id: uuidv4(),
    name: "Sabine Schulz",
    companyName: "Schulz Malermeisterin",
    imageUrl: "/placeholder.svg?height=200&width=200&query=female painter",
    skills: ["malerei", "tapezieren"],
    rating: 4.7,
    reviewCount: 87,
    postalCode: "50667",
    city: "Köln",
    phone: "+49 221 34567890",
    website: "https://schulz-malerei.example.de",
  },
  {
    id: uuidv4(),
    name: "Andreas Bauer",
    companyName: "Bauer Dachdeckerei",
    imageUrl: "/placeholder.svg?height=200&width=200&query=roofer",
    skills: ["dach", "isolierung"],
    rating: 4.5,
    reviewCount: 76,
    postalCode: "60311",
    city: "Frankfurt",
    phone: "+49 69 45678901",
    website: "https://bauer-dach.example.de",
  },
  {
    id: uuidv4(),
    name: "Peter Richter",
    companyName: "Richter Garten- und Landschaftsbau",
    imageUrl: "/placeholder.svg?height=200&width=200&query=landscaper",
    skills: ["garten", "pflasterung"],
    rating: 4.4,
    reviewCount: 65,
    postalCode: "70173",
    city: "Stuttgart",
    phone: "+49 711 56789012",
    website: "https://richter-garten.example.de",
  },
  {
    id: uuidv4(),
    name: "Martin Klein",
    companyName: "Klein Fliesenleger",
    imageUrl: "/placeholder.svg?height=200&width=200&query=tiler",
    skills: ["bodenbelag", "fliesen"],
    rating: 4.7,
    reviewCount: 92,
    postalCode: "01067",
    city: "Dresden",
    phone: "+49 351 67890123",
    website: "https://klein-fliesen.example.de",
  },
  {
    id: uuidv4(),
    name: "Christian Wolf",
    companyName: "Wolf Klima- und Kältetechnik",
    imageUrl: "/placeholder.svg?height=200&width=200&query=hvac technician",
    skills: ["sanitaer", "klima"],
    rating: 4.6,
    reviewCount: 83,
    postalCode: "30159",
    city: "Hannover",
    phone: "+49 511 78901234",
    website: "https://wolf-klima.example.de",
  },
];

export async function searchHandwerker({ plz = "", skill = "", page = 1 }: SearchHandwerkerOptions) {
  // Simulacija kašnjenja za realniji osećaj
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Filtriranje po PLZ i veštinama
  let filteredHandwerker = [...dummyHandwerker];
  
  if (plz) {
    filteredHandwerker = filteredHandwerker.filter(hw => 
      hw.postalCode.startsWith(plz.substring(0, Math.min(plz.length, 2)))
    );
  }
  
  if (skill) {
    filteredHandwerker = filteredHandwerker.filter(hw => 
      hw.skills.includes(skill)
    );
  }
  
  // Paginacija
  const limit = 4;
  const total = filteredHandwerker.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  const paginatedHandwerker = filteredHandwerker.slice(offset, offset + limit);
  
  return {
    handwerker: paginatedHandwerker,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    }
  };
}