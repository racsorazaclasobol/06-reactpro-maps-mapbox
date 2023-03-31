import { Map } from 'mapbox-gl';
import { createContext } from 'react';

interface MapContextProps {
    isMapReady: boolean;
    map?: Map,

    //Métodos
    setMap: ( map: Map) => void;
    getRouteBetweenTwoPoints: ( start: [ number, number ], end: [ number, number ]) => Promise<void>;
}


export const MapContext = createContext({} as MapContextProps);