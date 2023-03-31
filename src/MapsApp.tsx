import { PlacesProvider } from './contexts';
import { HomePage } from './pages';

import './styles.css'
import { MapProvider } from './contexts/maps/MapProvider';

export const MapsApp = () => {


	return (
		<PlacesProvider>
			<MapProvider>
				<HomePage />
			</MapProvider>
		</PlacesProvider>
	)
}
