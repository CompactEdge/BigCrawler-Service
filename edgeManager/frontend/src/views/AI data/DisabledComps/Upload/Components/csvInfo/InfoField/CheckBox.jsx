import { FormControl, FormControlLabel, makeStyles, Radio } from "@material-ui/core";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import radioStyle from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";
import React from "react";

const CheckBox = ({ checked, onChange, value, name, aria_lavel, label }) => {
    const selectStyles = makeStyles(selectStyle);
    const radioStyles = makeStyles(radioStyle);
    const selectClasses = selectStyles();
    const radioClasses = radioStyles();

    return (
        <FormControl className={selectClasses.selectFormControl} fullWidth>
            <div
                className={radioClasses.checkboxAndRadio + " " + radioClasses.checkboxAndRadioHorizontal}
                style={{ margin: 0 }}
            >
                <FormControlLabel
                    control={
                        <Radio
                            checked={checked}
                            onChange={(e) => onChange(e)}
                            value={value}
                            name={name}
                            aria-label={aria_lavel}
                            icon={<FiberManualRecord className={radioClasses.radioUnchecked} />}
                            checkedIcon={<FiberManualRecord className={radioClasses.radioChecked} />}
                            classes={{
                                checked: radioClasses.radio,
                                root: radioClasses.radioRoot,
                            }}
                        />
                    }
                    classes={{
                        label: radioClasses.label,
                    }}
                    label={label}
                />
            </div>
        </FormControl>
    );
};

export default CheckBox;
