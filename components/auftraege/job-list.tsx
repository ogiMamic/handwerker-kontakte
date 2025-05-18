// components/auftraege/job-list.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Euro, MapPin, Clock } from 'lucide-react';
import { Pagination } from "@/components/ui/pagination";

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

interface JobListProps {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentCategory: string;
}

const categories = [
  { value: "alle", label: "Alle Kategorien" },
  { value: "sanitaer", label: "Sanitär" },
  { value: "elektro", label: "Elektro" },
  { value: "tischlerei", label: "Tischlerei" },
  { value: "malerei", label: "Malerei" },
  { value: "bodenbelag", label: "Bodenbelag" },
  { value: "dach", label: "Dach" },
  { value: "garten", label: "Garten" },
];

export function JobList({ jobs, pagination, currentCategory }: JobListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("kategorie", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {pagination.total} Aufträge gefunden
        </h2>
        <div className="w-64">
          <Select value={currentCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kategorie auswählen" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">Keine Aufträge gefunden</h3>
          <p className="text-gray-500 mt-2">Bitte versuchen Sie es mit anderen Filterkriterien</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {job.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{job.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {job.city}, {job.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Euro className="h-4 w-4 mr-2" />
                    <span>Budget: {job.budget.toLocaleString("de-DE")} €</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Frist: {formatDate(job.deadline)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Erstellt: {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/auftrag/${job.id}`}>Details ansehen</Link>
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