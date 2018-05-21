/**
 * @description FEND Project 8 : Neighborhood
 * @description main component
 * @author Mohamed Riaad
 * @version 1.0
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import scriptLoader from 'react-async-script-loader';
import { MAP_KEY } from '../data/credentials';
import { mapStyles } from '../data/mapStyles.js';
import ListView from './ListView';
import spinner from '../images/circles-loader.svg';
import foursquare from '../images/foursquare.png';

class App extends Component {

  // define the default proptypes for component 
  static propTypes = {
    map: PropTypes.object,
    infowindow: PropTypes.object,
    bounds: PropTypes.object,
    mapCenter: PropTypes.object,
    mapReady :PropTypes.bool,
    mapError :PropTypes.bool
  }  

  // component state 
  state = {
    listOpen: true,
    map: {},
    infowindow: {},
    bounds: {},
    mapReady: false,
    mapCenter : { lat: 30.0594699, lng: 31.1884238 },// for future use when add location search
    mapError: false,
    width: window.innerWidth
  }

  // using the component life cycle 
  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  componentWillReceiveProps({isScriptLoadSucceed}){

    // Check if script is loaded and if map is defined
    if (isScriptLoadSucceed && !this.state.mapReady ) {

      // create map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: this.state.mapCenter,
        styles: mapStyles
      });

      // set up bounds and infowindow to use later
      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow({maxWidth: 300});

      this.setState({
        map: map,
        infowindow: infowindow,
        bounds: bounds,
        mapReady: true,
      });

    // alert user if map request fails
    } else if ( !this.state.mapReady ) {
      console.log("Map did not load");
      this.setState({mapError: true});
    }
  }

  toggleList = () => {

    const { width, listOpen, infowindow } = this.state;

    if (width < 600) {
      // close infowindow if listview is opening
      if (!listOpen) {
        infowindow.close();
      }
      this.setState( { listOpen: !listOpen});
    }
  }

  updateWidth = () => {
    const { map, bounds } = this.state;
    this.setState( { width: window.innerWidth });
    if (map && bounds) {
      map.fitBounds(bounds)
    }
  }

  render() {

    const { listOpen, map, infowindow, bounds, mapReady, mapCenter, mapError } = this.state;

    return (
      <div className="container" role="main">
        <nav id="list-toggle" className="toggle" onClick={this.toggleList}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"></path>
          </svg>
        </nav>
        <section
          id="restaurant-list"
          className={ listOpen ? "list open" : "list"}
          role="complementary"
          tabIndex={ listOpen ? '0' : '-1' }
          >
          <h1 className="app-title">Egypt Restaurants</h1>
          <hr />
          { /* render markers only when map has loaded */
            mapReady ?
            <ListView
              map={map}
              infowindow={infowindow}
              bounds={bounds}
              mapCenter={mapCenter}
              toggleList={this.toggleList}
              listOpen={listOpen}
            />
            // Show error message id map didn't load
            : <p>We are experiencing loading issues. Please check your internet connection</p>
          }
          <h3>Created By Mohamed Riaad</h3>
          <img src={foursquare} className="fs-logo" alt="foursquare" />

        </section>
        <section id="map" className="map" role="application">
          { mapError ?  // Show error message id map didn't load
            <div id="map-error" className="error" role="alert">
              Google Maps did not load.  Please try again later...
            </div>

              // load the map 
           
            : <div className="loading-map">
                <h4 className="loading-message">Map is loading...</h4>
                <img src={spinner} className="spinner" alt="loading indicator" />
             </div>
        }
        </section>
      </div>
    );
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`]
)(App);
