import './App.css';
import { useState, useEffect } from 'react';
import CoordinateLookup from './components/coordinateLookup/CoordinateLookup';
import Forecast from './components/forecast/Forecast';

function App() {
  const [homeLocation, setHomeLocation] = useState(null);

  useEffect(() => {
    if (!homeLocation) {
      let location = null;
      try {
        location = JSON.parse(localStorage.getItem('currentLocation'));
        console.log('Local storage location: ', JSON.stringify(location, null, 2));
        if (location) {
          setHomeLocation(location);
        }
      } catch (error) {
        console.log('Invalid location in local storage');
      }
    }
  }, [homeLocation, setHomeLocation]);

  const storeLocation = (location) => {
    if (location) {
      localStorage.setItem('currentLocation', JSON.stringify(location));
      setHomeLocation(location);
    }
  };


  return (
    <div className="App">
        <CoordinateLookup homeLocation={homeLocation} setHomeLocation={storeLocation} />
        <Forecast longitude={homeLocation?.lon} latitude={homeLocation?.lat} />
    </div>
  );
}

export default App;
