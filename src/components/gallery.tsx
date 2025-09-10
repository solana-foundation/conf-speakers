"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: { src: string }[];
  className?: string;
}

export function Gallery({ images, className }: GalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "Escape") {
      setIsDialogOpen(false);
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleImageClick(index)}
                className="group bg-muted focus:ring-ring relative aspect-square overflow-hidden rounded-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                <Image
                  src={image.src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>
            </DialogTrigger>
          </Dialog>
        ))}
      </div>

      {/* Full Screen Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent
          className="!block h-[90vh] w-[90vw] !max-w-none border-none bg-black/95 p-0"
          showCloseButton={false}
        >
          <div className="relative h-full w-full" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-4 z-10 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-4 z-10 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Main Image */}
            <div className="relative flex h-full w-full grow-0 items-center justify-center p-8">
              <Image
                src={images[selectedImageIndex]?.src}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-h-full max-w-full grow-0 object-contain"
                priority
              />
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 flex max-w-full -translate-x-1/2 transform gap-2 overflow-x-auto px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-all",
                      index === selectedImageIndex ? "border-white" : "border-transparent hover:border-white/50",
                    )}
                  >
                    <Image src={image.src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
