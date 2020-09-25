import React, { Component } from 'react'
import './Header.css'

export default class Header extends Component {
  render() {
    return (

      <div className="header__area">
        <h3 className="main__header">Restaurants' Review Site</h3>
        <p className="sort__title">Sort Here</p>
      </div>

    )
  }
}
