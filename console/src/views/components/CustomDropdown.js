import React, { useState } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
} from 'reactstrap';

const CustomDropdown = props => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleClickItem = e => {
    const value = e.target.innerText;
    props.onChange(value);
  };

  return (
    <div className="custom-drop" style={{ marginRight: '3px' }}>
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>{props.title}</InputGroupText>
        </InputGroupAddon>
        <UncontrolledDropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          style={{ maxWidth: '380px' }}>
          <DropdownToggle caret>{props.value}</DropdownToggle>
          <DropdownMenu style={{ fontSize: '14px', borderRadius: '15px' }}>
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
