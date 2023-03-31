import { useContext, useLayoutEffect, useRef } from "react"
import { Map } from "mapbox-gl";

import { PlacesContext } from "../contexts"
import { Loading } from "./Loading"
import { MapContext } from '../contexts/maps/MapContext';


export const MapView = () => {

    const { isLoading, userLocation } = useContext( PlacesContext );
    const { isMapReady, map, setMap } = useContext( MapContext );
    const mapDiv = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      
        if ( isLoading ) return;

        const map = new Map({
            container: mapDiv.current!, 
            style: 'mapbox://styles/mapbox/streets-v12', 
            center: userLocation, 
            zoom: 14, 
        });

        setMap( map );
    
    }, [isLoading])

    if ( isLoading ) {
        return ( <Loading /> )
    }
    
    return (
        <div 
            ref={ mapDiv }
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0
            }}
        >
            
        </div>
    )
}
