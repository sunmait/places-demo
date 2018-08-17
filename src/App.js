import React, { Component } from 'react';
import { getNearbyPlaces, GOOGLE_API_KEY } from './requests';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: '',
      lng: '',
      radius: '',
      places: [],
      nextPageToken: '',
    };
  }

  handleChangeInput = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSearchPlaces = async () => {
    const { lat, lng, radius } = this.state;
    const query = {
      location: `${lat},${lng}`,
      radius,
    };
    const res = await getNearbyPlaces(query);
    this.setState({ places: res.results, nextPageToken: res.next_page_token });
  };

  loadMorePlaces = async () => {
    const { nextPageToken, places } = this.state;
    const query = {
      pagetoken: nextPageToken,
    };
    const res = await getNearbyPlaces(query);
    this.setState({ places: [...places, ...res.results], nextPageToken: res.next_page_token });
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
              <span className="field-value">{`${place.geometry.location.lat} ${place.geometry.location.lng}`}</span>
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
            <img src={`https://maps.googleapis.com/maps/api/place/photo?key=${GOOGLE_API_KEY}&maxwidth=300&photoreference=${place.photos[0].photo_reference}`} />
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
        <div className="content">
          {this.state.places.map(this.renderPlaceCard)}
          {this.state.nextPageToken && (
            <div className="button" onClick={this.loadMorePlaces}>
              Load more
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
