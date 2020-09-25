import React from 'react';
import './Sidebar.css'

export default function RestaurantList({ picture, name, address, reviews,rating }) {
  return (
    <div className="side__bar">
      <div className="justify-content-between retaurant__info d-flex">
        <div >
          <img
            className="restaurant__icon"
            src={picture}
            alt="Restaurant"
          />
        </div>
        <div className="p-2">
          <h5>{name}</h5>
          <span>
            <strong>Address:</strong> {address}
          </span>        
            <div className="feedbacks">
              <span>
                <small className="side__barReview">{reviews}</small>
              </span>
              <small className="side__barReview">{rating}</small>
            </div>        
        </div>
      </div>
    </div>
  );
}
