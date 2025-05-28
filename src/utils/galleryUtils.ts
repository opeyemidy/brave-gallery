
import { ImageItem, FilterOptions } from '@/types/gallery';

export const filterAndSortImages = (
  images: ImageItem[],
  filters: FilterOptions
): ImageItem[] => {
  let filtered = images;

  // Apply search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(image =>
      image.galleryName.toLowerCase().includes(searchLower) ||
      image.url.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    
    if (filters.sortBy === 'galleryName') {
      comparison = a.galleryName.localeCompare(b.galleryName);
    } else if (filters.sortBy === 'url') {
      comparison = a.url.localeCompare(b.url);
    }
    
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};
