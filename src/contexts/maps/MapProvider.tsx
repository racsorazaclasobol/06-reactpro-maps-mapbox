import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "mapbox-gl";

import { MapContext } from './MapContext';
import { mapReducer } from "./mapReducer";
import { useReducer, useContext, useEffect } from 'react';

import { PlacesContext } from '../';
import directionsApi from "../../apis/directionsApi";
import { DirectionsResponse } from '../../interfaces/directions';

export interface MapState {
    isMapReady: boolean;
    map?: Map;
    markers: Marker[];
}

interface ChildrenProps {
    children: JSX.Element | JSX.Element[]
}

const INITIAL_STATE: MapState = {
    isMapReady: true,
    map: undefined,
    markers: [],
}

export const MapProvider = ({ children }: ChildrenProps) => {

    const [state, dispatch] = useReducer( mapReducer, INITIAL_STATE );

    const { places } = useContext( PlacesContext )

    const setMap = ( map: Map ) => {

        const myLocationPopup = new Popup().setHTML(`
        <h4>Aquí estoy</h4>
        <p>En algún lugar del mundo</p>
        `);

        new Marker({ color: 'tomato' })
        .setLngLat( map.getCenter() )
        .setPopup(myLocationPopup)
        .addTo( map );

        dispatch({ type: "setMap", payload: map })
    }

    const getRouteBetweenTwoPoints = async( start: [ number, number ], end: [ number, number ] ) => { //

        const resp = await directionsApi.get<DirectionsResponse>(`/${ start.join( ',' ) };${ end.join( ',' ) }`);
        const { distance, duration, geometry } = resp.data.routes[0];
        const { coordinates: coords } = geometry;

        let kms = distance / 1000; //Transformar la distancia en kilometros
            kms = Math.round( kms * 100 );
            kms /= 100; 

        const minutes = Math.floor( duration / 60 ); // De segundos a minutos

        console.log({ kms, minutes })

        const bounds = new LngLatBounds( start, start )

        for (const coord of coords) {
            const newCoord:[ number, number ] = [ coord[0], coord[1] ];
            bounds.extend( newCoord );
        }

        state.map?.fitBounds( bounds, {
            padding: 200
        })

        //Crear ruta para llegar a la direccion
        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }
        }

        //Remover polilines si ya hay una
        if(state.map?.getLayer('RouteString')){
            state.map.removeLayer('RouteString');
            state.map.removeSource('RouteString');
        }

        state.map?.addSource( 'RouteString', sourceData );
        state.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'blue',
                'line-width': 3
            }
        })

    }

    useEffect(() => {
        state.markers.forEach( marker  => marker.remove()); //Recorro los marcadores que ya estan y los borro

        const newMarkers: Marker[] = [];

        for (const place of places) {
            const [ lng, lat ] = place.center;
            const popup = new Popup()
                            .setHTML(`<h6>${ place.text_es }</h6> <p>${ place.place_name_es }</p>`);
            const newMarker = new Marker().setPopup( popup ).setLngLat([ lng, lat ]).addTo( state.map! );

            newMarkers.push( newMarker );
        }



        //Todo: Limpiar polylines
        
        dispatch({ type: 'setMarkers', payload: newMarkers });
  
    }, [ places ])
    

    return (
        <MapContext.Provider value={{ 
            // Variables
            ...state,

            //Metodos
            setMap,
            getRouteBetweenTwoPoints,
        }}>
            { children }
        </MapContext.Provider>
    )
}
