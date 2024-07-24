// MapComponent/index.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of MapComponentClient with server-side rendering disabled
const MapComponentClient = dynamic(() => import('./MapComponentClient'), {
    ssr: false, // Ensure this component is only rendered on the client side
});

interface MapComponentProps {
    lat: number;
    lon: number;
    temperature: string;
    location: string;
    iconCode: string;
}

const MapComponent: React.FC<MapComponentProps> = (props) => {
    return <MapComponentClient {...props} />;
};

export default MapComponent;
