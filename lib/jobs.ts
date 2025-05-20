export type Job = {
    id: string
    title: string
    description: string
    location: string
    budget: string
    category: string
    postedAt: string
    deadline: string
    status: "offen" | "vergeben" | "abgeschlossen"
  }
  
  export const jobs: Job[] = [
    {
      id: "1",
      title: "Badezimmerrenovierung",
      description: "Komplette Renovierung eines Badezimmers, einschließlich Fliesen, Sanitäranlagen und Beleuchtung.",
      location: "Berlin",
      budget: "5.000€ - 8.000€",
      category: "Sanitär",
      postedAt: "2023-05-15",
      deadline: "2023-06-30",
      status: "offen",
    },
    {
      id: "2",
      title: "Dachrinnenreinigung",
      description: "Reinigung der Dachrinnen eines Einfamilienhauses.",
      location: "München",
      budget: "200€ - 400€",
      category: "Dachdecker",
      postedAt: "2023-05-16",
      deadline: "2023-05-30",
      status: "offen",
    },
    {
      id: "3",
      title: "Elektroinstallation für Neubau",
      description: "Komplette Elektroinstallation für ein neues Einfamilienhaus.",
      location: "Hamburg",
      budget: "10.000€ - 15.000€",
      category: "Elektriker",
      postedAt: "2023-05-10",
      deadline: "2023-07-15",
      status: "vergeben",
    },
    {
      id: "4",
      title: "Gartenpflege",
      description:
        "Regelmäßige Gartenpflege für einen großen Garten, einschließlich Rasenmähen, Hecken schneiden und Unkraut jäten.",
      location: "Köln",
      budget: "150€ pro Monat",
      category: "Gärtner",
      postedAt: "2023-05-12",
      deadline: "2023-12-31",
      status: "offen",
    },
    {
      id: "5",
      title: "Fensteraustausch",
      description: "Austausch von 8 Fenstern in einem Altbau.",
      location: "Frankfurt",
      budget: "4.000€ - 6.000€",
      category: "Fensterbauer",
      postedAt: "2023-05-14",
      deadline: "2023-06-15",
      status: "offen",
    },
    {
      id: "6",
      title: "Malerarbeiten Wohnzimmer",
      description: "Streichen eines Wohnzimmers (30m²) inklusive Decke.",
      location: "Stuttgart",
      budget: "500€ - 800€",
      category: "Maler",
      postedAt: "2023-05-18",
      deadline: "2023-05-31",
      status: "offen",
    },
    {
      id: "7",
      title: "Parkettrenovierung",
      description: "Abschleifen und Versiegeln von Parkettboden in drei Zimmern (insgesamt 60m²).",
      location: "Düsseldorf",
      budget: "1.200€ - 1.800€",
      category: "Bodenleger",
      postedAt: "2023-05-11",
      deadline: "2023-06-10",
      status: "vergeben",
    },
    {
      id: "8",
      title: "Heizungsinstallation",
      description: "Installation einer neuen Gasheizung inklusive Heizkörper.",
      location: "Leipzig",
      budget: "7.000€ - 10.000€",
      category: "Heizungsbauer",
      postedAt: "2023-05-13",
      deadline: "2023-07-01",
      status: "offen",
    },
    {
      id: "9",
      title: "Dachsanierung",
      description: "Sanierung eines Satteldachs (150m²) inklusive Dämmung.",
      location: "Hannover",
      budget: "15.000€ - 20.000€",
      category: "Dachdecker",
      postedAt: "2023-05-09",
      deadline: "2023-08-15",
      status: "offen",
    },
    {
      id: "10",
      title: "Trockenbauarbeiten",
      description: "Errichtung von Trennwänden in einem Bürogebäude (ca. 100m²).",
      location: "Nürnberg",
      budget: "3.000€ - 5.000€",
      category: "Trockenbauer",
      postedAt: "2023-05-17",
      deadline: "2023-06-20",
      status: "offen",
    },
    {
      id: "11",
      title: "Gartenterrasse anlegen",
      description: "Anlegen einer Terrasse mit Naturstein (40m²).",
      location: "Dresden",
      budget: "4.000€ - 6.000€",
      category: "Gärtner",
      postedAt: "2023-05-19",
      deadline: "2023-07-10",
      status: "offen",
    },
    {
      id: "12",
      title: "Fassadendämmung",
      description: "Wärmedämmung einer Hausfassade (200m²).",
      location: "Essen",
      budget: "12.000€ - 18.000€",
      category: "Fassadenbauer",
      postedAt: "2023-05-08",
      deadline: "2023-08-01",
      status: "vergeben",
    },
    {
      id: "13",
      title: "Küchenmontage",
      description: "Montage einer neuen Küche inklusive Elektro- und Wasseranschlüsse.",
      location: "Dortmund",
      budget: "1.500€ - 2.500€",
      category: "Küchenmonteur",
      postedAt: "2023-05-20",
      deadline: "2023-06-05",
      status: "offen",
    },
    {
      id: "14",
      title: "Pflasterarbeiten Einfahrt",
      description: "Pflastern einer Einfahrt (50m²) mit Betonsteinen.",
      location: "Bremen",
      budget: "3.500€ - 5.500€",
      category: "Pflasterer",
      postedAt: "2023-05-21",
      deadline: "2023-07-15",
      status: "offen",
    },
    {
      id: "15",
      title: "Kellersanierung",
      description: "Sanierung eines feuchten Kellers inklusive Abdichtung und Drainage.",
      location: "Bonn",
      budget: "8.000€ - 12.000€",
      category: "Bausanierung",
      postedAt: "2023-05-07",
      deadline: "2023-08-30",
      status: "offen",
    },
  ]
  
  export async function getJobs(page = 1, pageSize = 10) {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedJobs = jobs.slice(startIndex, endIndex)
  
    return {
      jobs: paginatedJobs,
      totalJobs: jobs.length,
      totalPages: Math.ceil(jobs.length / pageSize),
      currentPage: page,
    }
  }
  