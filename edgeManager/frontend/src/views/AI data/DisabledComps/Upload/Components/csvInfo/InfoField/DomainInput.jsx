import { makeStyles, MenuItem } from "@material-ui/core";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";
import CustomInput from "components/CustomInput/CustomInput";
import GridItem from "components/Grid/GridItem";
import React from "react";
import { MockSelect } from "../../base";
import { defaultMainDomain } from "../../lib/defaultData";

export default function DomainInput({ domain, setDomain }) {
    const selectStyles = makeStyles(selectStyle);
    const selectClasses = selectStyles();

    const handleSelection = (e) => {
        const { value } = e.target;
        setDomain((prev) => ({
            ...prev,
            main_domain: value,
            target_domain: value + "__" + domain.sub_domain,
        }));
    };

    return (
        <>
            <GridItem xs={12} sm={6} md={5}>
                <MockSelect
                    label="Main domain"
                    id="main-domain"
                    name="maindomain"
                    value={domain.main_domain}
                    fullWidth
                    onChange={handleSelection}
                >
                    {defaultMainDomain.map((val, index) => {
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
                    })}
                </MockSelect>
            </GridItem>
            <GridItem xs={12} sm={6} md={5}>
                <CustomInput
                    value={domain.sub_domain}
                    labelText="Sub domain"
                    id="float"
                    formControlProps={{ fullWidth: true }}
                    onChange={(e) =>
                        setDomain((prev) => ({
                            ...prev,
                            sub_domain: e.target.value,
                            target_domain: domain.main_domain + "__" + e.target.value,
                        }))
                    }
                />
            </GridItem>
        </>
    );
}
