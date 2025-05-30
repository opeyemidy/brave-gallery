import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import ImageWithLoader from './ImageWithLoader';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

export const ImageModal = ({ isOpen, onClose, images, initialIndex }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [imageError, setImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setWidth(800);
    setHeight(600);
    setImageError(false);
    setImageDimensions(null);
  }, [initialIndex, isOpen]);

  const goToNext = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setZoom(1);
      setImageError(false);
      setImageDimensions(null);
    }
  }, [images]);

  const goToPrevious = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setZoom(1);
      setImageError(false);
      setImageDimensions(null);
    }
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, onClose, goToPrevious, goToNext]);



  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  // const handleIncreaseWidth = () => setWidth(prev => Math.min(prev + 100, window.innerWidth - 100));
  // const handleDecreaseWidth = () => setWidth(prev => Math.max(prev - 100, 200));
  // const handleIncreaseHeight = () => setHeight(prev => Math.min(prev + 100, window.innerHeight - 100));
  // const handleDecreaseHeight = () => setHeight(prev => Math.max(prev - 100, 200));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `image-${currentIndex + 1}.jpg`;
    link.click();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 m-0 border-0 bg-black/95 rounded-none">
        <DialogTitle className="sr-only">
          Image {currentIndex + 1} of {images.length}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Image gallery viewer. Use arrow keys or buttons to navigate between images.
        </DialogDescription>

        <div
          className="relative w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls */}
          <div className="absolute top-10 lg:top-4 right-4 z-50 flex flex-wrap items-center gap-2 bg-black/60 rounded-lg p-2">
            <Badge variant="secondary" className="mr-2">
              {currentIndex + 1} / {images.length}
            </Badge>
            <span className='block relative min-w-[97px] order-1 md:order-none'>
              {imageDimensions &&
                <Badge variant="outline" className="animate-in animate-out mr-2 text-white border-white/20">
                  {imageDimensions.width} × {imageDimensions.height}
                </Badge>
              }
            </span>
            <div className="flex items-center gap-1 border-r border-white/20 pr-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-white hover:bg-white/20">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-xs px-2">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-white hover:bg-white/20">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-white/20">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Image */}
          <div className="flex items-center justify-center w-full h-full overflow-hidden">
            {!imageError ? (
              <ImageWithLoader
                width={width}
                height={height}
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="object-contain transition-all duration-200"
                style={{
                  // width: `${width}px`,
                  // height: `${height}px`,
                  transform: `scale(${zoom})`
                }}
                onLoad={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                  const img = e.currentTarget as HTMLImageElement;
                  console.log('Image loaded:', img.naturalWidth, img.naturalHeight);
                  setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                  setImageError(false);
                }
                }
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-white text-center">
                <p className="mb-2">Failed to load image</p>
                <p className="text-sm text-gray-400">Image {currentIndex + 1} of {images.length}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-50"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-50"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-10 lg:bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex gap-2 justify-center overflow-x-auto max-w-full">
                {images.slice(Math.max(0, currentIndex - 5), currentIndex + 6).map((image, index) => {
                  const actualIndex = Math.max(0, currentIndex - 5) + index;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => {
                        setCurrentIndex(actualIndex);
                        setZoom(1);
                        setImageError(false);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${actualIndex === currentIndex ? 'border-white' : 'border-transparent hover:border-gray-400'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${actualIndex + 1}`}
                        width={60}
                        height={60}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};