import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import { basicFormInit } from "../lib/defaultData";
import CheckBox from "./InfoField/CheckBox";
import DomainInput from "./InfoField/DomainInput";
import Measurement from "./InfoField/Measurement";
import TimeIndex from "./InfoField/TimeIndex";

const defaultTimeStamp = {
    format: "",
    value: "",
    data_type: "String",
};

export default function BasicInfo({
    defaultMainDomain,
    domain,
    setDomain,
    timeIndex,
    setTimeIndex,
    csv_columns,
    measurement,
    setMeasurement,
    origin_columns,
    combineIndex,
    setCombineIndex,
}) {
    const [disabler, setDisabler] = React.useState([]);

    React.useEffect(() => {
        if (!combineIndex === false && timeIndex.length !== 2) {
            setTimeIndex((prev) => [
                ...prev,
                {
                    ...defaultTimeStamp,
                    format: "%H:%M:%S",
                },
            ]);
            setTimeIndex((prev) =>
                prev.map((field, index) => (index === 0 ? { ...field, format: "%Y/%m/%d" } : field)),
            );
        } else {
            setTimeIndex(basicFormInit.timeFormat);
        }
    }, [combineIndex]);

    const ChangeCombineIndex = () => {
        setCombineIndex((prev) => !prev);
    };

    const timeIndexSelection = (index, e) => {
        const { value, name } = e.target;
        setTimeIndex((prev) =>
            prev.map((timeCol, idx) =>
                index === idx
                    ? {
                          ...timeCol,
                          [name]: value,
                      }
                    : timeCol,
            ),
        );
        if (disabler[index]) {
            setDisabler(disabler.map((val, idx) => (idx === index ? value : val)));
        } else {
            setDisabler((prev) => [...prev, (disabler[index] = value)]);
        }
    };

    return (
        <form>
            <GridContainer
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <DomainInput domain={domain} setDomain={setDomain} />
                <GridItem xs={12} sm={4} md={4}>
                    <CheckBox
                        checked={!combineIndex}
                        onChange={() => ChangeCombineIndex()}
                        value="singular"
                        name="timeIndex"
                        aria_label="timeIndex"
                        label="Singular TimeIndex"
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                    <CheckBox
                        checked={combineIndex}
                        onChange={() => ChangeCombineIndex()}
                        value="singular"
                        name="timeIndex"
                        aria_label="timeIndex"
                        label="combine TimeIndex"
                    />
                </GridItem>
                <GridItem md={2}></GridItem>
                {new Array(timeIndex.length).fill(null).map((timeCol, index) => {
                    return (
                        <TimeIndex
                            value={timeIndex[index].value}
                            key={index}
                            idx={index}
                            csv_columns={csv_columns}
                            timeIndex={timeIndex}
                            label="Time index column"
                            name="timeIndex"
                            id="timeIndex"
                            onChange={(e) => timeIndexSelection(index, e)}
                            format={timeIndex[index].format}
                            md={5}
                            disabler={disabler}
                        />
                    );
                })}
                <GridItem xs={12} sm={4} md={3}>
                    <CheckBox
                        checked={measurement.type === "input"}
                        onChange={() =>
                            setMeasurement({
                                type: "input",
                                value: "",
                            })
                        }
                        value="input"
                        name="measurement"
                        aria_label="input"
                        label="generated-by-input"
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                    <CheckBox
                        checked={measurement.type === "columns"}
                        onChange={() =>
                            setMeasurement({
                                type: "columns",
                                value: "",
                            })
                        }
                        value="columns"
                        name="measurement"
                        aria_label="columns"
                        label="generated-by-columns"
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                    <CheckBox
                        checked={measurement.type === "filename"}
                        onChange={() =>
                            setMeasurement({
                                type: "filename",
                                value: "",
                            })
                        }
                        value="filename"
                        name="measurement"
                        aria_label="filename"
                        label="generated-by-filename"
                    />
                </GridItem>
                <Measurement
                    measurement={measurement}
                    origin_columns={origin_columns}
                    setMeasurement={setMeasurement}
                />
            </GridContainer>
        </form>
    );
}
