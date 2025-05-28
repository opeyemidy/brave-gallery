import ImageWithLoader from './ImageWithLoader';
export default function GalleryFallback({ imageUrls }: { imageUrls?: string[] }) {
    return (<div className="gallery-grid grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] w-screen min-h-screen">
        {imageUrls?.map((url, i) => (
            <a href={'#'} key={i} className="gallery-item block aspect-square">
                <ImageWithLoader
                    style={{ position: 'relative', height: '100%' }}
                    width={120}
                    height={120}
                    src={url}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(url)}
                    gifLoader="/cargando.gif"
                    alt={`Gallery item ${i}`}
                />
            </a>
        ))}
    </div>)

}
