/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import Radio from '@mui/material/Radio';
import MDBox from "components/MDBox";

function CustomIdCell({
  id,
  tap,
  selectedValue,
  setSelectedValue,
  setTableDataIdx,
}) {
  // console.log("tap", tap);

  const valueId = id.toString();

  // const handleChange = (e) => {
  //   console.log("e: ", e);
  // };

  const handleChange1 = (event) => {
    setSelectedValue(event.target.value);
    if (tap) {
      setTableDataIdx(`${tap}-${event.target.value}`);
    };
  };

  return (
    <MDBox display="flex" alignItems="center">
      <Radio
        checked={selectedValue === valueId}
        onChange={handleChange1}
        value={valueId || ""}
        name="radio-buttons"
        inputProps={{ 'aria-label': valueId }}
      />
    </MDBox>
  );
}

// Setting default value for the props of IdCell
CustomIdCell.defaultProps = {
  checked: false,
};

// Typechecking props for the IdCell
CustomIdCell.propTypes = {
};

export default CustomIdCell;
