/* eslint-disable no-undef */
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: '',
      lng: '',
      radius: '',
      places: [],
      goToNextPage: null,
    };
  }

  handleChangeInput = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSearchPlaces = async () => {
    const { lat, lng, radius } = this.state;
    const location = new google.maps.LatLng(lat, lng);
    const request = {
      location,
      radius,
    };
    const map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 15
    });
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, this.handleNearbySearchCallback);
  };

  handleNearbySearchCallback = (results, status, pagination) => {
    if (status !== 'OK') return;

    const { places } = this.state;

    const goToNextPage = pagination.hasNextPage ? () => {
      pagination.nextPage();
    } : null;
    this.setState({  places: [...places, ...results], goToNextPage });
  };

  renderPlaceCard = (place) => {
    return (
      <div className="place-card" key={place.id}>
        <div className="card-header">
          <img src={place.icon} />
          <h2>{place.name}</h2>
        </div>
        <div className="card-content">
          <div>
            <div className="field-container">
              <span className="field-name">Address: </span>
              <span className="field-value">{place.vicinity}</span>
            </div>
            <div className="field-container">
              <span className="field-name">Location: </span>
              <span className="field-value">{`${place.geometry.location.lat()} ${place.geometry.location.lng()}`}</span>
            </div>
            <div className="field-container">
              <span className="field-name">Rating: </span>
              <span className="field-value">{place.rating || 'none'}</span>
            </div>
            <div className="field-container">
              <span className="field-name">Tags: </span>
              <span className="field-value">{place.types.join(', ')}</span>
            </div>
          </div>
          {place.photos && (
            <img src={place.photos[0].getUrl({ 'maxWidth': 300 })} />
          )}
        </div>
      </div>
    )
  };

  render() {
    const { lat, lng, radius } = this.state;
    return (
      <div className="App">
        <div className="header">
          <div className="input-container">
            {'lat:'}
            <input
              className="input"
              onChange={this.handleChangeInput('lat')}
              value={lat}
            />
          </div>
          <div className="input-container">
            {'lng:'}
            <input
              className="input"
              onChange={this.handleChangeInput('lng')}
              value={lng}
            />
          </div>
          <div className="input-container">
            {'radius:'}
            <input
              className="input"
              onChange={this.handleChangeInput('radius')}
              value={radius}
            />
          </div>
          <div className="button" onClick={this.handleSearchPlaces}>
            Find
          </div>
        </div>
        <div id="map" />
        <div className="content">
          {this.state.places.map(this.renderPlaceCard)}
          {this.state.goToNextPage && (
            <div className="button" onClick={this.state.goToNextPage}>
              Load more
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
