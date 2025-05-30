'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
    className?: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    gifLoader?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    onError?: () => void
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function ImageWithLoader({ src, alt, width, height, onClick, className, style, onError, onLoad }: Props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        return () => {
            setLoading(true); // Reset loading state when src changes
        }
    }, [src]);
    return (
        <div style={style || { position: 'relative', width: 'inherit', height: 'inherit' }}>
            {loading && (
                // spinner
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                unoptimized={true} // Use unoptimized to avoid Next.js image optimization
                priority={false} // Set to false to avoid preloading
                // fill
                onLoad={(e) => {
                    onLoad?.(e);
                    console.log('Image loaded:', e);

                    setLoading(false)
                }}
                style={loading ? { opacity: 0 } : { transition: 'opacity 0.3s ease-in', opacity: 1 }}
                className={className}
                loading="lazy"
                onClick={onClick}
                onError={onError}
            // loader={() => '/cargando.gif'}
            />
        </div>
    );
}