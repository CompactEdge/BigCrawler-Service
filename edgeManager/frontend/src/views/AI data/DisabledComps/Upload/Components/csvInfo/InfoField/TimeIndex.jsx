import { makeStyles, MenuItem } from "@material-ui/core";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";
import CustomInput from "components/CustomInput/CustomInput";
import GridItem from "components/Grid/GridItem";
import { MockSelect } from "../../base";

const TimeIndex = ({ label, id, value, onChange, md, csv_columns, timeIndex, format, idx, disabler }) => {
    const selectStyles = makeStyles(selectStyle);
    const selectClasses = selectStyles();

    return (
        <>
            <GridItem xs={12} sm={6} md={md}>
                <MockSelect label={label} id={id} value={value} fullWidth name="value" onChange={onChange}>
                    {csv_columns !== undefined ? (
                        csv_columns.map((val) => (
                            <MenuItem
                                classes={{
                                    root: selectClasses.selectMenuItem,
                                    selected: selectClasses.selectMenuItemSelected,
                                }}
                                value={val.value}
                                key={val.index}
                                disabled={disabler[idx] !== val.value && disabler.includes(val.value)}
                            >
                                {val.value}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem
                            classes={{
                                root: selectClasses.selectMenuItem,
                                selected: selectClasses.selectMenuItemSelected,
                            }}
                            value={1}
                            disabled
                        >
                            no data
                        </MenuItem>
                    )}
                </MockSelect>
            </GridItem>
            <GridItem xs={12} sm={6} md={md}>
                <CustomInput
                    labelText="Time index Format"
                    id="format"
                    value={format}
                    formControlProps={{ fullWidth: true }}
                    name="format"
                    onChange={onChange}
                />
            </GridItem>
        </>
    );
};
export default TimeIndex;
