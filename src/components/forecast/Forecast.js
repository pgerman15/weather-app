import { useEffect, useState } from 'react';
import './Forecast.css';
import axios from 'axios';

const Forecast = ({longitude, latitude}) => {
    const [forecastData, setForecastData] = useState(null);

    const pointsAPIHost = 'https://api.weather.gov/points/'

    useEffect(() => {
        if (longitude && latitude) {
            console.log(`Found lat ${latitude} and long ${longitude}`)
            const pointsURL = `${pointsAPIHost}${latitude},${longitude}`
            axios.get(pointsURL)
                .then((response) => {
                    const { data } = response;
                    console.log('First response: ', data);
                    const forecastURL = data.properties.forecastHourly
                    console.log('ForecastUrl: ', forecastURL);
                    return axios.get(forecastURL);
                })
                .then((response) => {
                    const { data } = response;
                    console.log('Second call data: ', data);
                    setForecastData(data.properties.periods.map((period) => {
                        return {
                            startTime: period.startTime,
                            windSpeed: period.windSpeed,
                            temperature: period.temperature,
                            shortForecast: period.shortForecast
                        }
                    }));
                });
        }
    }, [latitude, longitude])

    return (
        <div>
            {`Lat: ${latitude}, Long: ${longitude}`}
            <br />
            {JSON.stringify(forecastData, null, 2)}
        </div>
    );
}

export default Forecast;