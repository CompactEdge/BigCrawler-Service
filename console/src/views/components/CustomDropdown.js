import React, { useState, useEffect } from 'react';
import {
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const CustomDropdown = props => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleClickItem = e => {
    const value = e.target.innerText;
    props.onChange(value);
  };

  return (
    <Col>
      <span>{props.title}</span>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>{props.value}</DropdownToggle>
        <DropdownMenu>
          {props.items.map((item, idx) => (
            <DropdownItem key={idx} onClick={handleClickItem}>
              {item}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </Col>
  );
};

export default CustomDropdown;
