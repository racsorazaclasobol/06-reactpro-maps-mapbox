import { PlacesProvider } from './contexts';
import { HomePage } from './pages';

import './styles.css'

export const MapsApp = () => {


	return (
		<PlacesProvider>

			<HomePage />
			
		</PlacesProvider>
	)
}
