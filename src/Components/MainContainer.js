import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    fetch("https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&min_rating=4&lang=en_US&currency=USD&restaurant_mealtype=seafood&limit=20&lunit=km&location_id=294210", {
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
  }, []);

  let curatedInfomation = [];
  mainState.data.forEach(item => {
    if (
      item.rating === 1
    )
      return;
    curatedInfomation.push(
      <RestaurantList
        key={item.id}
        name={item.name}
        address={item.address}
        picture={item.photo && item.photo.images.small.url}
        reviews={item.reviews}
      />,
    )
  })
  return (
    <div>
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

