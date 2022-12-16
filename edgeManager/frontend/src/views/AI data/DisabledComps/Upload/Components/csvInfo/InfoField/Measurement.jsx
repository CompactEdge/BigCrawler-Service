import { makeStyles, MenuItem } from "@material-ui/core";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";
import CustomInput from "components/CustomInput/CustomInput";
import GridItem from "components/Grid/GridItem";
import { MockSelect } from "../../base";

export default function Measurement({ measurement, setMeasurement, origin_columns }) {
    const selectStyles = makeStyles(selectStyle);
    const selectClasses = selectStyles();
    return (
        <>
            {measurement.type === "input" ? (
                <GridItem xs={12} sm={6} md={10}>
                    <CustomInput
                        style={{ margin: 0 }}
                        value={measurement.value}
                        labelText="input text"
                        id="float"
                        formControlProps={{ fullWidth: true }}
                        onChange={(e) =>
                            setMeasurement({
                                ...measurement,
                                value: e.target.value,
                            })
                        }
                    />
                </GridItem>
            ) : (
                measurement.type === "columns" && (
                    <GridItem xs={12} sm={6} md={10}>
                        <MockSelect
                            label="measurment"
                            id="measurment"
                            name="measurment"
                            fullWidth
                            value={measurement.value}
                            onChange={(e) => {
                                setMeasurement({
                                    ...measurement,
                                    value: e.target.value,
                                });
                            }}
                        >
                            {origin_columns !== undefined ? (
                                origin_columns
                                    .filter((col) => col.value.length !== 0)
                                    .map((val, index) => {
                                        return (
                                            <MenuItem
                                                classes={{
                                                    root: selectClasses.selectMenuItem,
                                                    selected: selectClasses.selectMenuItemSelected,
                                                }}
                                                value={val.value}
                                                key={index}
                                            >
                                                {val.value}
                                            </MenuItem>
                                        );
                                    })
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
                )
            )}
        </>
    );
}
