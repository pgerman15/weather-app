import { useState } from 'react';
import './CoordinateLookup.css';
import axios from 'axios'

const CoordinateResult = ({result, setHomeLocation}) => {

    return (
        <li className={'coordinate-result-row'}>
            <div className={'coordinate-result-item'}>
                {result?.display_name}
            </div>
            <div className={'coordinate-result-item'}>
                {`${result?.lat}, ${result?.lon}`}
            </div>
            <button onClick={() => {setHomeLocation(result)}}>Select Location</button>
        </li>
    );
}

function CoordinateLookup({homeLocation, setHomeLocation}) {
  const [addressSearch, setAddressSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const geolocationURL = 'https://geocode.maps.co/search';

  console.log('Set home location: ', setHomeLocation);

  const selectHomeLocation = (location) => {
    setSearchResults([]);
    setHomeLocation(location);
  }

  const lookupCoordinates = async () => {
    const results = await axios.get(geolocationURL, {
        params: {
            q: addressSearch,
        },
    });
    setSearchResults(results.data);
  };

  return (
    <div className="coordinate-lookup-container">
        <span>Selected location: {homeLocation?.display_name}</span>
        <div className="location-input">
            <input onChange={(e) => { setAddressSearch(e.target.value) }}/>
            <button onClick={lookupCoordinates}>Lookup</button>
        </div>
        <div>
            <ul className="result-list">
                {
                    searchResults.map((result) => <CoordinateResult result={result} setHomeLocation={() => { selectHomeLocation(result) }} />)
                }
            </ul>
        </div>
    </div>
  );
}

export default CoordinateLookup;
