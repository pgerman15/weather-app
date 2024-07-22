import { useState } from 'react';
import './CoordinateLookup.css';
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search';

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
        <span>{homeLocation?.display_name}</span>
        <div className="location-input">
            <input onChange={(e) => { setAddressSearch(e.target.value) }}/>
            <SearchIcon onClick={lookupCoordinates}></SearchIcon>
        </div>
        <ul className={searchResults.length > 0 ? 'result-list-display' : 'result-list-hide'}>
            {
                searchResults.map((result) => <CoordinateResult result={result} setHomeLocation={() => { selectHomeLocation(result) }} />)
            }
        </ul>
    </div>
  );
}

export default CoordinateLookup;
