import React from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import { Input } from 'reactstrap';
import './mains.css'
import SideBar from './SideBar';
import Map from './Map'

export default class MainContainer extends React.Component {
  state = {
    rating: '',
    restaurant:'',
    data: [],
    modals: false,
  };

  listenToUserRatingInput = (rating) => {
    this.setState(() => ({
      rating: rating.trim()
    }));
  };
  saveRestuarant = (newRestuarant) => {
    this.setState(initialList => ({
      data: [
        ...initialList.data,
        newRestuarant
      ],
      modals: false
    }))
  }

  componentDidMount() {
    fetch("https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&lang=en_US&currency=USD&Restaurant_Review=true&restaurant_mealtype=seafood&limit=30&lunit=km&location_id=294210", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "${process.env.REACT_APP_RAPID_API_KEY}",
        "useQueryString": true
      }
    })
      .then(raw => raw.json())
      .then(response => this.setState({ data: response.data }))
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let curatedData = [];
    this.state.data.forEach((individualRestaurants, id) => {
      if (
        individualRestaurants.rating && individualRestaurants.rating.toLowerCase().indexOf(this.state.rating.toLowerCase()) === -1
      )
        return;
      curatedData.push(
        <SideBar
          key={id}
          name={individualRestaurants.name}
          address={individualRestaurants.address}
          picture={individualRestaurants.photo && individualRestaurants.photo.images.small.url}
          reviews={individualRestaurants.rating}
        />,
      )
    })

    return (
      <div className="main__container">
        <div className="header__section">
          <div className="main__header">
            <h2>Restaurant Review Site</h2>
          </div>
          <div className="filter__field">
            <Input
              className="userInput__text"
              type="number"
              name="rating"
              placeholder="filter"
              value={this.state.rating}
              onChange={(e) => this.listenToUserRatingInput(e.target.value)}
            />
          </div>
        </div>
        <div className="main__section">
          <div>
            <Map
              data={this.state.data}
              saveRestuarant={this.saveRestuarant}
            />
          </div>
          <div className="side__bar" style={{ width: '390px', height: 'auto' }}>
            <FreeScrollBar>
              {curatedData}
            </FreeScrollBar>
          </div>
        </div>
      </div>
    );
  }
}
