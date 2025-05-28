
import { ImageItem } from '@/types/gallery';
import ImageWithLoader from './ImageWithLoader';

interface ImageCardProps {
  image: ImageItem;
  onImageClick: (url: string, galleryName: string) => void;
}

export const ImageCard = ({ image, onImageClick }: ImageCardProps) => {
  return (
    <div className="w-full h-full">
      <ImageWithLoader
        width={60}
        height={60}
        src={image.url}
        alt={`Image from ${image.galleryName}`}
        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onImageClick(image.url, image.galleryName)}
        gifLoader="/cargando.gif"
      />
    </div>
  );
};
