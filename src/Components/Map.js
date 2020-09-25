import React from 'react';
import ReactMapboxGl, { Layer, Feature, Marker, Popup, ZoomControl } from 'react-mapbox-gl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Input } from 'reactstrap';
import './Map.css'
const LocalMap = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiYWtpbnllbWkxNDcyIiwiYSI6ImNrMXoyNW92dDBsZ2UzaG12Mm9xNGhmdGcifQ.RlIm2uIf_39XH1hbaG4C7A',
});
export default class Map extends React.Component {
  state = {
    width: "1000",
    height: "auto",
    longitude: 39.658871,
    latitude: -4.043740,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    newRestuarant: {},
    userLocation: {
      longitude: 39.658871,
      latitude: -4.043740
    }

  };

  handleOnChange = (e) => {
    const { name, value } = e.target
    this.setState(prev => ({
      newRestuarant: {
        ...prev.newRestuarant,
        [name]: value
      },

    }))
  }
  handtoggle = () => {
    this.setState(prev => ({
      modals: !prev.modals,
    }))
  }

  onNameChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    });
  };

  markerClick = (restaurant) => {
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
  _onClickMap = (_map, evt) => {
    this.setState({
      newRestuarant: {
        name: '',
        _address: '',
        latitude: evt.lngLat.wrap().lat,
        longitude: evt.lngLat.wrap().lng,
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
      return this.handtoggle()
    } else {
      return null
    }
  }
  reviewsReset = () => {
    this.setState({
      addReview: '',
      addRatings: ''
    })
  }
  addItem = () => {
    const { addReview, restaurant, addRatings } = this.state;

    if (restaurant.reviews) {
      let newb = restaurant.reviews.concat({
        rating: addRatings,
        title: addReview
      })
      this.setState(prev => ({
        restaurant: {
          ...prev.restaurant,
          reviews: newb
        }
      }));
    } else {
      let newb = {
        rating: addRatings,
        title: addReview
      }
      this.setState(prev => ({
        restaurant: {
          ...prev.restaurant,
          reviews: [newb]
        }
      }));
    }
    this.reviewsReset()
  };
  saveRestaurant = () => {
    this.props.saveRestuarant(this.state.newRestuarant)
    this.handtoggle()
  }

  handleUserLocation = (position) => {  
    this.setState.addControl({
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
        this.markerClick(null);
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
    const { modals, addReview, restaurant, addRatings } = this.state;
    return (
      <LocalMap
        onClick={this._onClickMap}
        onStyleLoad={this.onMapLoad}
        center={[this.state.longitude, this.state.latitude]}
        style={`mapbox://styles/mapbox/streets-v11`}
        containerStyle={{
          height: '100vh',
          width: '73vw',
          marginTop: '0'
        }}
      >
        <ZoomControl />
        <Marker
          coordinates={[this.state.longitude, this.state.latitude]}
        >         
        </Marker>
        <Layer type="symbol" id="marker" layout={layoutLayer} images={images}>
          {this.props.data.map((item) =>
            <Feature
              key={item.id}
              coordinates={[item.longitude, item.latitude]}
              onClick={() => this.markerClick(item)}
            />
          )}
        </Layer>
        {restaurant && (
          <Popup
            className="pop__up"
            key={restaurant.id}
            anchor="bottom-right"
            coordinates={[restaurant.longitude, restaurant.latitude]}

          >
            <div >
              <button type="button" class="close" aria-label="Close" onClick={() => this.setState({ restaurant: undefined })}>
                <span aria-hidden="true">&times;</span>
              </button>
              <image src={restaurant.photo.images.small.url} width="193px" height="250" alt="res image" />
              <h4>{restaurant.name} </h4>
              <p> {restaurant._address}</p>
              <div className="">
                <input
                  value={addReview} onChange={this.onNameChange}
                  className="form-control mb-1"
                  type="text"
                  name="addReview"
                  placeholder="Add your review"
                />
                <input
                  value={addRatings} onChange={this.onNameChange}
                  className="form-control mb-1"
                  type="number"
                  name="addRatings"
                  placeholder="Add your rating"
                />
                <button className="btn btn-success btn-block" onClick={this.addItem}>Add</button>
              </div>
              {restaurant.reviews && restaurant.reviews.length ? restaurant.reviews.map(item =>
                <div key={item.id}>
                  <small className="rating">{item.title}</small> <br></br>
                  <small className="rating">{item.rating}</small>
                </div>
              ) : null}
            </div>
          </Popup>
        )}
        <Modal isOpen={modals} toggle={this.handtoggle} >
          <ModalHeader toggle={this.handtoggle}>Add New Restaurant</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col sm={10}>
                <Input type="name"
                  name="name"
                  onChange={this.handleOnChange}
                  value={this.state.newRestuarant.name}
                  placeholder="Restuarant Name" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={10}>
                <Input type="_address"
                  name="_address"
                  onChange={this.handleOnChange}
                  value={this.state.newRestuarant._address}
                  placeholder="Restuarant Address" />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveRestaurant}>Publish</Button>{' '}
            <Button color="secondary" onClick={this.handtoggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </LocalMap>
    );
  }
}
