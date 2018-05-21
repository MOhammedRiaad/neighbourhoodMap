/**
 * @description FEND Project 8 : Neighborhood
 * @description main component
 * @author Mohamed Riaad
 * @version 1.0
 */

 /**
 * @description import my credentials for security reasons . 
 */
import { CLIENT_ID, CLIENT_SECRET } from '../data/credentials'

const sortName = (a, b) => {
  // remove case senstivity
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // if names are equal
  return 0;
};

/**
 * @description sending request to foursquare to get restaurants  
 */
// url and params
const fSURL = 'https://api.foursquare.com/v2/venues/';
const VERS = '20171227';
const RADIUS = '5000'
const CATEGORIES = {
  food:'4d4b7105d754a06374d81259',
  foodcourt :'4bf58dd8d48988d120951735',
  diner :'4bf58dd8d48988d147941735',
  cafe :'4bf58dd8d48988d16d941735'
  
}

/**
 * @description making array from  category objects sent in link  . 
 */

 const CATEGORY_ID = Object.keys(CATEGORIES).map((cat) => CATEGORIES[cat]);

export const getFSLocations = (mapCenter) => {

  const requestURL = `${fSURL}search?ll=${mapCenter.lat},${mapCenter.lng}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERS}&categoryId=${CATEGORY_ID}&radius=${RADIUS}&limit=50`
  return fetch(requestURL)
  .then(response => {
      if (!response.ok) {
        throw response
      } else  return response.json()
    })
  .then(data => {
    const places = data.response.venues;
    console.log(places.length)

    const goodPlaces = places.filter( place => place.location.address && place.location.city && place.location.city === "Cairo");
    if(goodPlaces.length >=5 ){
      goodPlaces ;

      goodPlaces.sort(sortName);
      return goodPlaces;

    }else{
      places;

      places.sort(sortName);
      return places;

    }

    // sort restaurants in area for trusted ones  before updating state
    

  })

}

export const getFSDetails = (fsid) => {
  // use Foursquare id for search
  const FSID =  fsid;

  const requestURL = `${fSURL}${FSID}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERS}`
  return  fetch(requestURL)
  .then(response => {
      if (!response.ok) {
        throw response
      } else  return response.json()
    })
}
