import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap'
import RestaurantList from './Sidebar';
import Map from './Map'
import FreeScrollBar from 'react-free-scrollbar';
import './mains.css'

export default function MainContainer() {
  const [mainState, setMainState] = useState({
    rating: '',
    data: [],
    restaurant: '',
    modals: false,
  });
  const saveRestuarant = (newRestuarant) => {
    setMainState(prev => ({
      data: [
        ...prev.data,
        newRestuarant
      ],
      modals: false
    }));
  };
  const updateRating = (rating) => {
    setMainState(() => ({
      rating: rating.trim()
    }));
  };

  
  useEffect(() => {
    fetch("https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&lang=en_US&currency=USD&Restaurant_Review=true&restaurant_mealtype=seafood&limit=30&lunit=km&location_id=294210", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "8ca5ce6677msh14574fb727786c0p18f193jsn3a255ea64ee0",
        "useQueryString": true
      }
    })
      .then(raw => raw.json())
      .then(response => setMainState({ data: response.data }))
      .catch(err => {
        console.log(err);
      });
  });

  let curatedInfomation = [];
  // let homeland=mainState.data;
  mainState.data.forEach(individualRestaurant => {
    if (       
        individualRestaurant.rating === -1
      )     
      return;
    curatedInfomation.push(
      <RestaurantList key={individualRestaurant.id}
        name={individualRestaurant.name}
        address={individualRestaurant.address}
        picture={individualRestaurant.photo && individualRestaurant.photo.images.small.url}
        reviews={individualRestaurant.rating}
      />,
    )
  })
  return (
    <div>
      <div className="header__section">
        <div className="main__heading">
          <h2>Restaurant Review Site</h2>
        </div>
        <div className="filter__field">
          <span><Input
            type="number"
            name="rating"
            placeholder="filter by rating"
            value={mainState.rating}
            onChange={(e) => updateRating(e.target.value)}
          />
          </span>
        </div>
      </div>
      <div className="main__content">
        <div className='for__map' >
          <Map
            data={mainState.data}
            saveRestuarant={saveRestuarant}
          />
        </div>
        <div
          key=""
          className="" style={{ width: '33em' }}>
          <FreeScrollBar>
            {curatedInfomation}
          </FreeScrollBar>
        </div>
      </div>
    </div>
  );
}

