import axios from "axios";

const searchApi = axios.create({
    baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    params: {
        limit: 5,
        language: 'es',
        access_token: 'pk.eyJ1IjoicmF6YWNsYSIsImEiOiJjbGNqa3JxdDg1czVuM3dwN2lhMWM3dzBvIn0.rU4B0fN9xBLUEuUnPJ9xng'
    }
});

export default searchApi;