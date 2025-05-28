import { ImageItem } from '@/types/gallery';
import data from './data.json';

export const generateMockData = (): ImageItem[] => {
  const imageItems: ImageItem[] = [];

  // Convert data.json structure to ImageItem format
  data.forEach((item: { name: string; images: string[] }, index: number) => {
    const name = item.name;
    const image = item.images[1];

    // Create an ImageItem for each image in the set
    imageItems.push({
      id: `${name}-${index}`,
      galleryName: `${name} Image ${index + 1}`,
      url: image,
    });
  });

  return imageItems.reverse();
};

export const mockData = generateMockData();
