import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
} from 'reactstrap';

const addonStyle = {
  padding: '0px 10px',
  color: '#ef8157',
  borderWidth: '2px',
  borderRadius: '3px 0 0 3px',
  backgroundColor: '#444444',
  borderColor: '#444444',
  fontSize: '11px',
  fontWeight: '550',
};

const dropdownButtonStyle = {
  margin: '0',
  borderRadius: '0 3px 3px 0',
  padding: '7px',
};

const CustomDropdown = props => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleClickItem = e => {
    const value = e.target.innerText;
    props.onChange(value);
  };

  return (
    <div style={{ marginRight: '3px' }}>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText style={addonStyle}>{props.title}</InputGroupText>
        </InputGroupAddon>
        <UncontrolledDropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          style={{ maxWidth: '380px' }}>
          <DropdownToggle style={dropdownButtonStyle} caret>
            {props.value}
          </DropdownToggle>
          <DropdownMenu style={{ fontSize: '14px' }}>
            {props.items.map((item, idx) => (
              <DropdownItem key={idx} onClick={handleClickItem}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </InputGroup>
    </div>
  );
};

export default CustomDropdown;
