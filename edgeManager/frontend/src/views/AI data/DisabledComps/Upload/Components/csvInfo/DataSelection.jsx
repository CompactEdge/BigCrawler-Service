import { makeStyles, MenuItem } from "@material-ui/core";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import { MockInput, MockSelect } from "../base";
import { sign } from "../lib/defaultData";
import ButtonSet from "./ButtonSet";

export default function DataSelection({ compareRules, setCompareRules, csv_columns, timeIndex }) {
    const selectStyles = makeStyles(selectStyle);
    const selectClasses = selectStyles();

    // value 값 존재 유무 검사 (함수형 밸류)
    const timeIndexCheck = (() => {
        for (const timeCol of timeIndex) {
            if (timeCol.value.length === 0) {
                return false;
            }
        }
        return true;
    })();

    // timeIndex 와 같은 컬럼 값 인지 검사 (함수형 밸류)
    const timeIndexArrays = (() => {
        const temp = [];
        for (const timeCol of timeIndex) {
            temp.push(timeCol.value);
        }
        return temp;
    })();

    return (
        <>
            {compareRules.map((v, i) => {
                return (
                    <GridContainer
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                        key={"compareRules" + i + "_" + v}
                    >
                        <GridItem xs={12} sm={6} md={3}>
                            <MockSelect
                                fullWidth
                                label={`Column_ ${i + 1}`}
                                id={"compareColumn_" + i}
                                name={"compareColumn_" + i}
                                onChange={(e) => {
                                    const temp = [...compareRules];
                                    temp[i] = {
                                        // ...compareRules[i],
                                        compareColumn: e.target,
                                    };

                                    setCompareRules(temp);
                                }}
                                value={
                                    compareRules[i]["compareColumn"] !== undefined
                                        ? compareRules[i]["compareColumn"].value || ""
                                        : ""
                                }
                            >
                                {csv_columns !== undefined && timeIndexCheck ? (
                                    csv_columns
                                        .filter((col) => col.value.length !== 0)
                                        .map((v) =>
                                            !timeIndexArrays.includes(v.value) ? (
                                                <MenuItem
                                                    classes={{
                                                        root: selectClasses.selectMenuItem,
                                                        selected: selectClasses.selectMenuItemSelected,
                                                    }}
                                                    value={v}
                                                    key={v.index}
                                                >
                                                    {v.value}
                                                </MenuItem>
                                            ) : (
                                                <MenuItem
                                                    classes={{
                                                        root: selectClasses.selectMenuItem,
                                                        selected: selectClasses.selectMenuItemSelected,
                                                    }}
                                                    value={v}
                                                    key={v.index}
                                                    disabled
                                                >
                                                    {v.value}
                                                </MenuItem>
                                            ),
                                        )
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
                        <GridItem xs={12} sm={6} md={3}>
                            <MockSelect
                                fullWidth
                                label={`Function_ ${i + 1}`}
                                id={"compareColumn_" + i}
                                name={"compareSign"}
                                onChange={(e) => {
                                    const temp = [...compareRules];
                                    temp[i] = {
                                        ...compareRules[i],
                                        compareSign: e.target.value,
                                    };

                                    setCompareRules(temp);
                                }}
                                value={
                                    compareRules[i]["compareSign"] !== undefined
                                        ? compareRules[i]["compareSign"] || ""
                                        : ""
                                }
                            >
                                {compareRules[i].compareColumn !== undefined ? (
                                    compareRules[i].compareColumn.value.data_type !== "Float" ? (
                                        sign.char.map((charValue) => (
                                            <MenuItem
                                                classes={{
                                                    root: selectClasses.selectMenuItem,
                                                    selected: selectClasses.selectMenuItemSelected,
                                                }}
                                                value={charValue.value}
                                                key={charValue.label}
                                            >
                                                {charValue.value}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        sign.float.map((floatValue) => (
                                            <MenuItem
                                                classes={{
                                                    root: selectClasses.selectMenuItem,
                                                    selected: selectClasses.selectMenuItemSelected,
                                                }}
                                                value={floatValue.value}
                                                key={floatValue.label}
                                            >
                                                {floatValue.value}
                                            </MenuItem>
                                        ))
                                    )
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

                        <GridItem xs={12} sm={6} md={4}>
                            <MockInput
                                label={`Value_${i + 1}`}
                                id=""
                                value={compareRules[i].compareValue || ""}
                                onChange={(e) => {
                                    const temp = [...compareRules];
                                    temp[i] = {
                                        ...compareRules[i],
                                        compareValue: e.target.value,
                                    };

                                    setCompareRules(temp);
                                }}
                            />
                        </GridItem>
                        <GridItem sm={6} />
                    </GridContainer>
                );
            })}
            <GridContainer
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
                direction="row"
            >
                <GridItem md={4}></GridItem>
                <GridItem md={3}></GridItem>
                <GridItem xs={12} sm={12} md={3}>
                    <ButtonSet compareRules={compareRules} setCompareRules={setCompareRules} />
                </GridItem>
            </GridContainer>
        </>
    );
}
