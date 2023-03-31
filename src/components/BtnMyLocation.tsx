import { useContext } from 'react';
import { MapContext } from '../contexts';
import { PlacesContext } from '../contexts/places/PlacesContext';


export const BtnMyLocation = () => {

    const { map, isMapReady } = useContext( MapContext );
    const { userLocation    } = useContext( PlacesContext );

    const onClick = () => {
        if( !isMapReady ) throw new Error( 'El mapa no está listo' );
        if( !userLocation )throw new Error( 'La ubicación no está disponible' );

        map?.flyTo({ zoom: 14, center: userLocation })

    }


    return (
        <button 
            className="btn btn-primary"
            onClick={ onClick }
            style={{ 
                position: "fixed",
                top: '20px',
                right:'20px',
                zIndex: 999,
            }}
            >
            Mi Ubicación
        </button>
    )
}
