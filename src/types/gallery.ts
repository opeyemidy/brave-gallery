
export interface ImageItem {
  id: string;
  url: string;
  galleryName: string;
}

export interface FilterOptions {
  searchTerm: string;
  sortBy: 'galleryName' | 'url';
  sortOrder: 'asc' | 'desc';
}
