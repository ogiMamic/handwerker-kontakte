// components/handwerker/handwerker-search.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Globe } from 'lucide-react';
import { Pagination } from "@/components/ui/pagination";

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

interface HandwerkerSearchProps {
  handwerker: Handwerker[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  initialPlz: string;
  initialSkill: string;
}

const skills = [
  { value: "", label: "Alle Fähigkeiten" },
  { value: "sanitaer", label: "Sanitär" },
  { value: "elektro", label: "Elektro" },
  { value: "tischlerei", label: "Tischlerei" },
  { value: "malerei", label: "Malerei" },
  { value: "bodenbelag", label: "Bodenbelag" },
  { value: "dach", label: "Dach" },
  { value: "garten", label: "Garten" },
];

export function HandwerkerSearch({ handwerker, pagination, initialPlz, initialSkill }: HandwerkerSearchProps) {
  const [plz, setPlz] = useState(initialPlz);
  const [skill, setSkill] = useState(initialSkill);
  const router = useRouter();
  const pathname = usePathname();
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (plz) params.set("plz", plz);
    if (skill) params.set("skill", skill);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (plz) params.set("plz", plz);
    if (skill) params.set("skill", skill);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="plz" className="block text-sm font-medium mb-1">
                Postleitzahl
              </label>
              <Input
                id="plz"
                placeholder="z.B. 10115"
                value={plz}
                onChange={(e) => setPlz(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="skill" className="block text-sm font-medium mb-1">
                Fähigkeit
              </label>
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Fähigkeit auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                Suchen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {pagination.total} Handwerker gefunden
        </h2>
      </div>

      {handwerker.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">Keine Handwerker gefunden</h3>
          <p className="text-gray-500 mt-2">Bitte versuchen Sie es mit anderen Suchkriterien</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {handwerker.map((hw) => (
            <Card key={hw.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={hw.imageUrl || "/placeholder.svg?height=64&width=64&query=person"}
                      alt={hw.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{hw.companyName}</CardTitle>
                    <p className="text-sm text-gray-500">{hw.name}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(hw.rating)}
                      <span className="text-sm text-gray-500 ml-2">
                        ({hw.reviewCount} Bewertungen)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {hw.city}, {hw.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{hw.phone}</span>
                  </div>
                  {hw.website && (
                    <div className="flex items-center text-gray-500">
                      <Globe className="h-4 w-4 mr-2" />
                      <a href={hw.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website besuchen
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Fähigkeiten:</p>
                  <div className="flex flex-wrap gap-2">
                    {hw.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={`/handwerker/${hw.id}`}>Profil ansehen</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}