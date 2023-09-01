import { useEffect, useState } from 'react';
import './CoordinateLookup.css';
import axios from 'axios'

const CoordinateResult = ({result}) => {

    return (
        <li className={'coordinate-result-row'}>
            <div className={'coordinate-result-item'}>
                {result.display_name}
            </div>
            <div className={'coordinate-result-item'}>
                {`${result.lat}, ${result.lon}`}
            </div>
        </li>
    );
}

function CoordinateLookup() {

  const [addressSearch, setAddressSearch] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const geolocationURL = 'https://geocode.maps.co/search?q=eagle+mountain+utah'

  const lookupCoordinates = async () => {
    console.log('Address: ', addressSearch);
    const results = await axios.get(geolocationURL, {
        params: {
            q: addressSearch,
        },
    });
    setSearchResults(results.data);
  };

  return (
    <div className="coordinate-lookup-container">
        <div className="location-input">
            <input onChange={(e) => { setAddressSearch(e.target.value) }}/>
            <button onClick={lookupCoordinates}>Lookup</button>
        </div>
        <div>
            <ul className="result-list">
                {
                    searchResults.map((result) => <CoordinateResult result={result}/>)
                }
            </ul>
        </div>
    </div>
  );
}

export default CoordinateLookup;
