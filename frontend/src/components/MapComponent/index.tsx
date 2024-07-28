import React from 'react';
import dynamic from 'next/dynamic';
import { MapComponentProps } from '@/types/mapData';

// Dynamic import of MapComponentClient with server-side rendering disabled
const MapComponentClient = dynamic(() => import('./MapComponentClient'), {
    ssr: false, // Ensure this component is only rendered on the client side
});

const MapComponent: React.FC<MapComponentProps> = (props) => {
    return <MapComponentClient {...props} />;
};

export default MapComponent;
