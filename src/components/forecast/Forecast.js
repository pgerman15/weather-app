import { useEffect, useState } from 'react';
import './Forecast.css';
import axios from 'axios';
import moment from 'moment';
import { getTimes } from 'suncalc';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AirIcon from '@mui/icons-material/Air';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const {
    microPlaneWindMax,
    parkFlyerMax
} = require('../../config').flightParams;

console.log('config: ', {
    microPlaneWindMax,
    parkFlyerMax,
});

const Forecast = ({longitude, latitude}) => {
    const [forecastData, setForecastData] = useState(null);
    const pointsAPIHost = 'https://api.weather.gov/points/';

    useEffect(() => {
        if (longitude && latitude) {
            console.log(`Found lat ${latitude} and long ${longitude}`)
            console.log('Date: ', new Date());
            console.log('Times: ', getTimes(new Date(), latitude, longitude));
            const pointsURL = `${pointsAPIHost}${latitude},${longitude}`
            axios.get(pointsURL)
                .then((response) => {
                    const { data } = response;
                    const forecastURL = data.properties.forecastHourly;
                    return axios.get(forecastURL);
                })
                .then((response) => {
                    const { data } = response;

                    const hourlyForecasts = data.properties.periods.map((period) => {
                        const shortDayCode = moment(period.startTime).format('dddd').substring(0, 3);

                        return {
                            startTime: period.startTime,
                            windSpeed: period.windSpeed,
                            temperature: period.temperature,
                            shortForecast: period.shortForecast,
                            precipitationChance: period.probabilityOfPrecipitation.value,
                            shortDayCode,
                        }
                    });
                    const groupedHourlyForecasts = hourlyForecasts.reduce((builtObject, hourlyForecast) => {
                        const { shortDayCode, startTime } = hourlyForecast;
                        const forecastDate = moment(startTime).format('MM-DD');
                        
                        if (!builtObject[forecastDate]) {
                            console.log('Date used: ', new Date(forecastDate));
                            console.log('Sun times: ', getTimes(new Date(forecastDate), longitude, latitude));
                            const { dawn, dusk, goldenHour, goldenHourEnd } = getTimes(new Date(forecastDate), longitude, latitude);

                            builtObject[forecastDate] = {
                                day: shortDayCode,
                                sunTimes: {
                                    dawn,
                                    dusk,
                                    goldenHour,
                                },
                                hours: []
                            };
                        }

                        builtObject[forecastDate].hours.push(hourlyForecast);
                        return builtObject;
                    }, {});

                    const forecastDates = Object.keys(groupedHourlyForecasts);
                    const orderedDates = forecastDates.sort((date1, date2) => {
                        return moment(date1).isBefore(date2) ? 1 : 2
                    });

                    const hourlyForecastsByDay = orderedDates.map((orderedDate) => {
                        return {
                            date: orderedDate,
                            ...groupedHourlyForecasts[orderedDate]
                        };
                    });

                    setForecastData(hourlyForecastsByDay);
                });
        }
    }, [latitude, longitude]);

    return (
        <div>
            <div className="current-forecast">
                <h2>Now</h2>
                <div className="current-forecast-data">
                    <div className="icon">
                        <DeviceThermostatIcon></DeviceThermostatIcon>
                    </div>
                    <span>{forecastData && forecastData[0].hours[0].temperature}&deg;</span>
                    <div className="icon">
                        <AirIcon></AirIcon>
                    </div>
                    <span>{forecastData && forecastData[0].hours[0].windSpeed}</span>
                    <div className="icon">
                        <UmbrellaIcon></UmbrellaIcon>
                    </div>
                    <span>{forecastData && forecastData[0].hours[0].precipitationChance}%</span>
                </div>
                <div className="current-forecast-description">
                    {forecastData && forecastData[0].hours[0].shortForecast}
                </div>
            </div>
            <ul className="forecast-list">
                {forecastData?.map((dayForecast) => {
                    return (
                        <li>
                            <div className="day-header">
                                <span>{dayForecast.day} {dayForecast.date}</span>
                            </div>
                            <div>
                                <ul className="hourly-list">
                                    {dayForecast.hours.map((hourlyForecast) => {
                                        const { startTime, windSpeed, temperature, precipitationChance } = hourlyForecast;
                                        const windSpeedNumber = windSpeed.substring(0, windSpeed.indexOf(' mph'));
                                        const convertedWindSpeed = parseInt(windSpeedNumber);

                                        const canMicroFly = convertedWindSpeed <= microPlaneWindMax;
                                        const canParkFly = convertedWindSpeed <= parkFlyerMax;
                                        const startTimeMoment = moment(startTime);

                                        const isDaylight = startTimeMoment.isAfter(moment(dayForecast.sunTimes.dawn)) && startTimeMoment.isBefore(dayForecast.sunTimes.goldenHour);

                                        return (
                                            <li key={startTime} className={isDaylight ? 'day-time' : 'night-time'}>
                                                <div>{moment(startTime).format('hh:mm A')}</div>
                                                <div>Wind: {windSpeed}</div>
                                                <div>Temp: {temperature}</div>
                                                <div>Precip. chance: {precipitationChance}%</div>
                                                <div className={canMicroFly ? 'check-icon' : 'close-icon'}>
                                                    Micro Planes: {canMicroFly ? <CheckIcon sx={{color: 'green'}}></CheckIcon> : <CloseIcon sx={{color: 'red'}}></CloseIcon>}
                                                </div>
                                                <div className={canParkFly ? 'check-icon' : 'close-icon'}>
                                                    Park Flyers: {canParkFly ? <CheckIcon sx={{color: 'green'}}></CheckIcon> : <CloseIcon sx={{color: 'red'}}></CloseIcon>}
                                                </div>
                                                <div>
                                                    Daylight: {isDaylight ? 'true' : 'false'}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

{
    // const { startTime, windSpeed, temperature, shortForecast, precipitationChance, shortDayCode } = hourlyForecast;
    /* <li key={startTime}>
    <div>{shortDayCode} {moment(startTime).format('hh:mm A')}</div>
    <div>Wind: {windSpeed}</div>
    <div>Temp: {temperature}</div>
    <div>Short forecast: {shortForecast}</div>
    <div>Precipitation chance: {precipitationChance}</div>
</li> */}

export default Forecast;