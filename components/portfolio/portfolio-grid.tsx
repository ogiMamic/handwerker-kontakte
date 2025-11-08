"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, DollarSign, Trash2, Edit } from "lucide-react"

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  images: string[]
  completionDate?: string
  budget?: number
  clientTestimonial?: string
  featured: boolean
}

interface PortfolioGridProps {
  items: PortfolioItem[]
  isOwner?: boolean
  onEdit?: (item: PortfolioItem) => void
  onDelete?: (id: string) => void
}

export function PortfolioGrid({ items, isOwner = false, onEdit, onDelete }: PortfolioGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Noch keine Portfolio-Einträge vorhanden.</p>
          {isOwner && (
            <p className="text-sm text-muted-foreground mt-2">Fügen Sie Ihre abgeschlossenen Projekte hinzu.</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              {item.images[0] ? (
                <Image src={item.images[0] || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">Kein Bild</div>
              )}
              {item.featured && <Badge className="absolute top-2 right-2 bg-yellow-500">Hervorgehoben</Badge>}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit?.(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete?.(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {item.completionDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.completionDate).toLocaleDateString("de-DE")}
                  </div>
                )}
                {item.budget && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {item.budget.toLocaleString("de-DE")}€
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setSelectedItem(item)}>
                Details ansehen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.title}</DialogTitle>
                <DialogDescription>{selectedItem.category}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedItem.images.length > 0 && (
                  <div className="grid gap-2">
                    {selectedItem.images.map((image, index) => (
                      <div key={index} className="relative h-64 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${selectedItem.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Beschreibung</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                {selectedItem.clientTestimonial && (
                  <div>
                    <h4 className="font-semibold mb-2">Kundenbewertung</h4>
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{selectedItem.clientTestimonial}&rdquo;
                    </p>
                  </div>
                )}
                <div className="flex gap-6 text-sm">
                  {selectedItem.completionDate && (
                    <div>
                      <span className="font-semibold">Fertigstellung:</span>{" "}
                      {new Date(selectedItem.completionDate).toLocaleDateString("de-DE")}
                    </div>
                  )}
                  {selectedItem.budget && (
                    <div>
                      <span className="font-semibold">Budget:</span> {selectedItem.budget.toLocaleString("de-DE")}€
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
