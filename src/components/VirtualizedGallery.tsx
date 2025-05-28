'use client';
'use client';

import { useMemo, useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { ImageCard } from './ImageCard';
import { ImageModal } from './ImageModal';
import { ImageItem } from '@/types/gallery';

interface VirtualizedGalleryProps {
  images: ImageItem[];
  containerHeight: number;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    images: ImageItem[];
    columnCount: number;
    onImageClick: (url: string, galleryName: string) => void;
  };
}

const GridItem = ({ columnIndex, rowIndex, style, data }: GridItemProps) => {
  const { images, columnCount, onImageClick } = data;
  const index = rowIndex * columnCount + columnIndex;
  const image = images[index];

  if (!image) return null;

  return (
    <div style={style}>
      <ImageCard image={image} onImageClick={onImageClick} />
    </div>
  );
};

export const VirtualizedGallery = ({ images, containerHeight }: VirtualizedGalleryProps) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContainerWidth(window.innerWidth);
    }
  }, []);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    initialIndex: number;
  }>({
    isOpen: false,
    imageUrl: '',
    initialIndex: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { columnCount, columnWidth, rowHeight } = useMemo(() => {
    const minColumnWidth = 120;
    const maxColumnWidth = 200;

    // Calculate how many columns can fit with minimum width
    let columns = Math.floor(containerWidth / minColumnWidth);

    // Calculate the actual column width to fill the container completely
    let colWidth = Math.floor(containerWidth / columns);

    // If the calculated width is too large, increase columns
    while (colWidth > maxColumnWidth && columns < 20) {
      columns++;
      colWidth = Math.floor(containerWidth / columns);
    }

    const height = 120;

    return {
      columnCount: columns,
      columnWidth: colWidth,
      rowHeight: height
    };
  }, [containerWidth]);

  const rowCount = Math.ceil(images.length / columnCount);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImageClick = (url: string, galleryName: string) => {
    const initialIndex = images.findIndex(img => img.url === url);

    setModalState({
      isOpen: true,
      imageUrl: url,
      initialIndex: Math.max(0, initialIndex)
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        width={containerWidth}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={rowHeight}
        itemData={{
          images,
          columnCount,
          onImageClick: handleImageClick
        }}
        style={{ outline: 'none' }}
      >
        {GridItem}
      </Grid>

      <ImageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        images={images.map(img => img.url)}
        initialIndex={modalState.initialIndex}
      />
    </>
  );
};