import {
  Button,
  IconButton,
  makeStyles,
  MenuItem,
  Popover,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MockInput, MockSelect } from "../base";
import { dataSet, dataType } from "../lib/defaultData";

const ButtonContain = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  margin: 0;
  & > * {
    margin: 0;
    padding: 0;
  }
`;
const ColumnContain = styled.div`
  display: flex;
  flex-flow: row;
`;
const CoulmnsStyle = styled.p`
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-weight: bold;
  margin: 0;
`;

const EditorBoard = styled.div`
  display: flex;
  padding: 20px 15px;
  flex-flow: column;
`;

/* eslint-disable react/prop-types */
export default function HeaderButton({
  columns,
  setCsvData,
  csvData,
  csvCheckIn,
}) {
  const { data_set, data_type, value } = columns;
  const initalstate = {
    column_name: value,
    data_set: {
      label: data_set,
      value: data_set,
    },
    data_type: {
      label: data_type,
      value: data_type,
    },
  };

  const [display, setDisplay] = useState(null);

  const [editResult, setEditResult] = useState(initalstate);

  const [columnName, setColumnName] = useState(value);

  useEffect(() => {
    setEditResult(initalstate);
  }, [columns]);

  const selects = makeStyles(selectStyle);
  const classes = selects();

  //Remove Header
  const handleOnRemove = (data) => {
    const { columns, rows } = csvData;
    const index = columns[0].indexOf(data);
    if (index !== -1) {
      setCsvData((prev) => ({
        ...prev,
        columns: columns.filter((e) => e.splice(index, 1)),
        rows: rows.filter((e) => e.splice(index, 1)),
      }));
    }
  };
  //Edit Header
  const handleOnEdit = (oldData, newData) => {
    const { columns, origin_columns } = csvData;
    let selectedCheck = [];
    if (origin_columns !== undefined) {
      origin_columns[0].map((data) => {
        selectedCheck.push(data.index);
      });

      const ogirin_index = selectedCheck.indexOf(oldData.index);
      const index = columns[0].indexOf(oldData);

      if (index !== -1) {
        origin_columns[0][ogirin_index] = {
          ...newData,
        };

        columns[0][index] = {
          ...newData,
        };

        setCsvData((prev) => ({
          ...prev,
          columns: [[...columns[0]]],
          origin_columns: [[...origin_columns[0]]],
        }));
      }
    }
  };
  //popup visible
  const handleClick = (e) => {
    setDisplay(e.target);
    setColumnName(editResult.column_name);
  };
  // popup not visible
  const handleClose = () => {
    setEditResult(initalstate);
    setDisplay(null);
  };
  // value !=null === true
  const open = Boolean(display);

  const id = open ? "simple-popover" : undefined;

  const onChange = (e) => {
    setColumnName(e.target.value);
  };

  // dataSet & datatype handling
  const handleDataset = (e) => {
    const { value } = e.target;
    setEditResult((data) => ({
      ...data,
      data_set: { label: value, value: value },
    }));
  };
  const handleDatatype = (e) => {
    const { value } = e.target;
    setEditResult((data) => ({
      ...data,
      data_type: { label: value, value: value },
    }));
  };

  return (
    <ColumnContain>
      <CoulmnsStyle>{editResult.column_name}</CoulmnsStyle>
      {!csvCheckIn ? (
        <ButtonContain>
          <IconButton
            aria-label="edit"
            color="default"
            size="small"
            onClick={handleClick}
          >
            <Edit fontSize="small" />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={display}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            style={{
              height: "auto",
            }}
          >
            <EditorBoard>
              <h3>Editor</h3>
              <GridContainer>
                <GridItem sm={12} md={12} xs={12}>
                  <MockInput
                    label="column name"
                    id="column-name"
                    value={columnName}
                    onChange={onChange}
                  />
                </GridItem>
                <GridItem sm={12} md={12} xs={12}>
                  <MockSelect
                    label="DATA SET"
                    id="data-set"
                    name="dataSet"
                    onChange={handleDataset}
                    value={editResult.data_set.value || ""}
                  >
                    {dataSet.map((val, index) => {
                      return (
                        <MenuItem
                          key={index}
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={val.value}
                        >
                          {val.value}
                        </MenuItem>
                      );
                    })}
                  </MockSelect>
                </GridItem>
                <GridItem sm={12} md={12} xs={12}>
                  <MockSelect
                    label="DATA TYPE"
                    id="data-type"
                    name="dataType"
                    onChange={handleDatatype}
                    readOnly={false}
                    value={editResult.data_type.value || ""}
                  >
                    {dataType.map((val, index) => {
                      return (
                        <MenuItem
                          key={index}
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected,
                          }}
                          value={val.value}
                        >
                          {val.value}
                        </MenuItem>
                      );
                    })}
                  </MockSelect>
                </GridItem>
                <GridItem>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    onClick={() => {
                      handleOnEdit(columns, {
                        ...columns,
                        value: columnName,
                        data_set: editResult.data_set.value,
                        data_type: editResult.data_type.value,
                      });
                      setDisplay(null);
                    }}
                  >
                    save
                  </Button>
                </GridItem>
              </GridContainer>
            </EditorBoard>
          </Popover>
          <IconButton
            aria-label="close"
            color="secondary"
            size="small"
            onClick={() => handleOnRemove(columns)}
          >
            <Close fontSize="small" />
          </IconButton>
        </ButtonContain>
      ) : (
        ""
      )}
    </ColumnContain>
  );
}
