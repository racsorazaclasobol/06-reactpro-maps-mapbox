import React 	from 'react'
import ReactDOM from 'react-dom/client'
import mapboxgl from 'mapbox-gl';

import { MapsApp } from './MapsApp'
 
mapboxgl.accessToken = 'pk.eyJ1IjoicmF6YWNsYSIsImEiOiJjbGNqa3JxdDg1czVuM3dwN2lhMWM3dzBvIn0.rU4B0fN9xBLUEuUnPJ9xng';

if( !navigator.geolocation ){
  alert( 'Tu navegador y/o dispositivo no tiene acceso a la geolocalización' );
  throw new Error('Tu navegador y/o dispositivo no tiene acceso a la geolocalización');
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<MapsApp />
	</React.StrictMode>,
)
