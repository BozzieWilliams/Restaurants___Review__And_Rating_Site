import React from 'react';
import './mains.css'
export default class SideBar extends React.Component {
  render() {
    return (
      <div className="side__bar">
        <div className="retaurant__info">
          <div >
            <img
              className="restaurantView__Image"
              src={this.props.picture}
              alt="Restaurant__Icon"
            />
          </div>
          <div>
            <h6 className="restaurant__OfficialName"><strong>{this.props.name}</strong></h6>
            <span>
              {this.props.address}
            </span>
            <div className="incident__stars">
              <span>
                <small className="side__barReview">{this.props.reviews}<span role="img" aria-label="star">🌟</span></small>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
