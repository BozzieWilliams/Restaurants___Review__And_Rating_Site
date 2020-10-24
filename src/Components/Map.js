import React from 'react';
import ReactMapboxGl, { Layer, Feature, Marker, Popup, ZoomControl, } from 'react-mapbox-gl';
import { Button, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './mains.css'
const LocalMap = ReactMapboxGl({ accessToken: '${process.env.REACT_APP_MAP_API_KEY}' });
export default class Map extends React.Component {
  state = {
    width: "800",
    height: "100vh",
    longitude: 39.658871,
    latitude: -4.043740,
    bearing: 0,
    pitch: 0,
    zoom: 15,
    newRestuarantName: '',
    newRestuarantAddress: '',
    restaurant: undefined,
    center: [],
    modals: false,
    toggle: false,
    addReview: '',
    addRatings: '',
    newRestuarant: {},
    userLocation: {
      longitude: 0,
      latitude: 0,
    }
  };

  handleOnChange = (e) => {
    const { name, value } = e.target
    this.setState(initialList => ({
      newRestuarant: {
        ...initialList.newRestuarant,
        [name]: value
      },

    }))
  }
  handleModaltoggle = () => {
    this.setState(initialAction => ({
      modals: !initialAction.modals,
    }))
  }

  onnewAddedRestaurantName = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    });
  };


  mapMarkerClick = (restaurant) => {
    console.log(restaurant)
    this.setState({
      center: [this.state.longitude, this.state.latitude],
      restaurant,
      modals: false,
      toggle: false
    });

  };

  onStyleLoad = (map) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  onDrag = () => {
    if (this.state.data) {
      this.setState({ data: undefined });
    }
  };

  _onClickMap = (_map, e) => {
    this.setState({
      newRestuarant: {
        name: '',
        _address: '',
        latitude: e.lngLat.wrap().lat,
        longitude: e.lngLat.wrap().lng,
        photo: {
          images: {
            small: {
              url: 'https://www.linguahouse.com/linguafiles/md5/d01dfa8621f83289155a3be0970fb0cb'
            }
          }
        },
        reviews: [],
      },
    })

    if (this.state.restaurant === undefined) {
      return this.handleModaltoggle()
    } else {
      return null
    }
  }
  reviewsToDefaultState = () => {
    this.setState({
      addReview: '',
      addRatings: ''
    })
  }

  UserAddedInfo = () => {
    const { addReview, restaurant, addRatings } = this.state;

    if (restaurant.reviews) {
      let userInputData = restaurant.reviews.concat({
        rating: addRatings,
        title: addReview
      })
      this.setState(initialList => ({
        restaurant: {
          ...initialList.restaurant,
          reviews: userInputData
        }
      }));
    } else {
      let userInputData = {
        rating: addRatings,
        title: addReview
      }
      this.setState(initialList => ({
        restaurant: {
          ...initialList.restaurant,
          reviews: [userInputData]
        }
      }));
    }
    this.reviewsToDefaultState()
  };

  saveRestaurant = () => {
    this.props.saveRestuarant(this.state.newRestuarant)
    this.handleModaltoggle()
  }

  handleUserLocation = (position) => {
    this.setState({
      userLocation: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.handleUserLocation(position)
    });
    const listener = e => {
      if (e.key === "Escape") {
        this.mapMarkerClick(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }
  render() {
    const image = new Image();
    image.src = `${require('../Icon.png')}`
    const images = ['marker', image];
    const layoutLayer = { 'icon-image': 'marker' }
    const { modals, addReview, restaurant, userLocation, addRatings } = this.state;
    return (
      <LocalMap
        className="local__map"
        onClick={this._onClickMap}
        onStyleLoad={this.onMapLoad}
        center={[this.state.longitude, this.state.latitude]}
        style={`mapbox://styles/mapbox/streets-v11`}
      >
        <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
          {this.props.data.map((individualRestaurants, id) =>
            <Feature key={id} coordinates={[individualRestaurants.longitude, individualRestaurants.latitude]}
              onClick={() => this.mapMarkerClick(individualRestaurants)}
            />
          )}
        </Layer>
        <Marker
          coordinates={[userLocation.longitude, userLocation.latitude]} anchor="bottom"
        >
        </Marker>
        {restaurant && (
          <Popup
            className="pop__up"
            key={restaurant.id}
            anchor="bottom-right"
            coordinates={[restaurant.longitude, restaurant.latitude]}
          >
            <div >
              <button type="button" className="close" aria-label="Close" onClick={() => this.setState({ restaurant: undefined })}>
                <span aria-hidden="true" className="ratingInput__render">&times;</span>
              </button>
              <h4>{restaurant.name} </h4>
              <p> {restaurant._address}</p>
              <div className="">
                <input
                  value={addReview} onChange={this.onnewAddedRestaurantName}
                  className="modalRatings__inputField"
                  type="text"
                  name="addReview"
                  placeholder="Key In Your Review"
                />
                <input
                  value={addRatings} onChange={this.onnewAddedRestaurantName}
                  className="modalRatings__inputField"
                  type="number"
                  name="addRatings"
                  placeholder="Key In Your Ratings"
                />
                <button className="submit__button" onClick={this.UserAddedInfo}>Submit Your Ratings</button>
              </div>
              {restaurant.reviews && restaurant.reviews.length ? restaurant.reviews.map((individualRestaurants, id) =>
                <li key={id}>
                  {individualRestaurants.title}
                  {individualRestaurants.rating}
                  {individualRestaurants.review}
                </li>
              ) : null}
            </div>
          </Popup>
        )}
        <Modal isOpen={modals} toggle={this.handleModaltoggle} >
          <ModalHeader toggle={this.handleModaltoggle}>Add A New Restuarant</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <div className="modal__inputField">
                <Input type="name"
                  name="name"
                  onChange={this.handleOnChange}
                  value={this.state.newRestuarant.name}
                  placeholder="Restuarant Name" />
              </div>
            </FormGroup>
            <FormGroup row>
              <div className="modal__inputField">
                <Input type="_address"
                  name="_address"
                  onChange={this.handleOnChange}
                  value={this.state.newRestuarant._address}
                  placeholder="Restuarant Address" />
              </div>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button className="submit__button" onClick={this.saveRestaurant}>Post</Button>{' '}
            <Button className="cancel__button" onClick={this.handleModaltoggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <ZoomControl />
      </LocalMap>
    );
  }
}
