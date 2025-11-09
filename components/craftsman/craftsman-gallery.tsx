"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

interface CraftsmanGalleryProps {
  portfolio?: Array<{
    id: string
    title: string
    description: string
    imageUrl: string
    category: string
  }>
}

export function CraftsmanGallery({ portfolio }: CraftsmanGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (!portfolio || portfolio.length === 0) return null

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null && portfolio) {
      setSelectedImage((selectedImage + 1) % portfolio.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null && portfolio) {
      setSelectedImage((selectedImage - 1 + portfolio.length) % portfolio.length)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Galerie der Arbeiten</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {portfolio.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity group"
          >
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title || `Bild ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0">
          {selectedImage !== null && portfolio && (
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-video">
                <Image
                  src={portfolio[selectedImage].imageUrl || "/placeholder.svg"}
                  alt={portfolio[selectedImage].title || `Bild ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {(portfolio[selectedImage].title || portfolio[selectedImage].description) && (
                <div className="p-4 bg-background">
                  {portfolio[selectedImage].title && (
                    <h4 className="font-semibold text-lg mb-1">{portfolio[selectedImage].title}</h4>
                  )}
                  {portfolio[selectedImage].description && (
                    <p className="text-sm text-muted-foreground">{portfolio[selectedImage].description}</p>
                  )}
                </div>
              )}

              {portfolio.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {portfolio.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
