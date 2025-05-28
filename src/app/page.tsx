'use client';

import { useState, useEffect, useMemo } from 'react';
import { VirtualizedGallery } from '@/components/VirtualizedGallery';
import { mockData } from '@/utils/mockData';
import { filterAndSortImages } from '@/utils/galleryUtils';
import { FilterOptions } from '@/types/gallery';
// import GalleryFallback from '@/components/GalleryFallback';

const Index = () => {
  const [filters] = useState<FilterOptions>({
    searchTerm: '',
    sortBy: 'galleryName',
    sortOrder: 'asc'
  });
  const [containerHeight, setContainerHeight] = useState(600);

  const allImages = useMemo(() => {
    return mockData;
  }, []);

  const filteredImages = useMemo(
    () => filterAndSortImages(allImages, filters),
    [allImages, filters]
  );

  useEffect(() => {
    const updateHeight = () => {
      setContainerHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  console.log(`Loaded ${allImages.length} images, showing ${filteredImages.length} after filtering`);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <VirtualizedGallery
        images={filteredImages}
        containerHeight={containerHeight}
      />
    </div>
  );
};

export default Index;
{/* <GalleryFallback imageUrls={filteredImages.map((image) => image.url)} /> */ }