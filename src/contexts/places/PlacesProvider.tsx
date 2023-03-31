import { useEffect, useReducer } from 'react';

import { PlacesContext      } from './PlacesContext';
import { placesReducer      } from './placesReducer';
import { getUserLocation    } from '../../helpers/getUserLocation';
import { Feature, PlacesResponse     } from '../../interfaces/places';
import { default as searchApi } from '../../apis/searchApi';


export interface PlacesState {
    isLoading       : boolean;
    userLocation?   : [ number, number ];
    isLoadingPlaces : boolean;
    places          : Feature[];
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

const INITIAL_STATE: PlacesState = {
    isLoading       : true,
    userLocation    : undefined,
    isLoadingPlaces : false,
    places          : [],
}


export const PlacesProvider = ( { children }: Props ) => {

    const [state, dispatch] = useReducer( placesReducer, INITIAL_STATE );


    const searchPlacesByTerm = async( query: string ): Promise<Feature[]> => {

        if( query.length === 0 ) { //Limpiamos la busqueda anterior
            dispatch({ type: 'setPlaces', payload: [] })
            return [];
        };
        if( !state.userLocation ) throw new Error('No hay acceso a la geolocalizacion');

        dispatch({ type: 'setLoadingPlaces' });

        const resp = await searchApi.get<PlacesResponse>( `/${ query }.json`, {
            params: {
                proximity: state.userLocation.join(',')
            }
        });

        dispatch({ type: 'setPlaces', payload: resp.data.features })

        return resp.data.features;
    }


    useEffect(() => {
      
        getUserLocation().then( lngLat => dispatch({ type: 'setUserLocation', payload: lngLat }) );

    }, []);  

    return (

        <PlacesContext.Provider value={{ 
            //Variables
            ...state,

            //Métodos
            searchPlacesByTerm,
            
        }}>
            { children }
        </PlacesContext.Provider>

    )
}
