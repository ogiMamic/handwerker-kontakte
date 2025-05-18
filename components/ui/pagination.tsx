// components/ui/pagination.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show only a window of pages
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 3) {
      return [...pages.slice(0, 5), "...", totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, "...", ...pages.slice(totalPages - 5)];
    }
    
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Vorherige Seite</span>
      </Button>
      
      {getVisiblePages().map((page, i) => (
        page === "..." ? (
          <Button key={`ellipsis-${i}`} variant="outline" disabled>
            ...
          </Button>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(Number(page))}
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Nächste Seite</span>
      </Button>
    </div>
  );
}