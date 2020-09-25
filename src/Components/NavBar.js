import React, { useState } from 'react';
import logo from '../img/GetRestaurants.png';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';

const NavBar = () => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);
  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3">
      <img
        className="my-0 mr-md-auto"
        style={{ width: 50, height: 50 }}
        src={logo}
        alt="logo"
      />
      <nav className="my-2 my-md-0 mr-md-3">
        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
          <Button id="caret" color="danger">
            Our Sevices
          </Button>
          <DropdownToggle caret />
          <DropdownMenu>
            <DropdownItem>Order</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Search</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>FAQ</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>About us</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </nav>
      <Button color="outline-danger">Sign up</Button>
    </div>
  );
};

export default NavBar;

// AIzaSyDORqRLx_gBNHSIyIwx83em3z_q8nI2ICc
