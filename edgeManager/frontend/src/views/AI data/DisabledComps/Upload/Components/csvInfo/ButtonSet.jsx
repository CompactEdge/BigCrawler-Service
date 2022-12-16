import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import Button from "components/CustomButtons/Button.js";
import React from "react";
import styled from "styled-components";

export default function ButtonSet({ compareRules, setCompareRules }) {
    const Contain = styled.div`
        display: flex;
        justify-content: flex-end;
    `;

    return (
        <Contain>
            <Button
                type="button"
                color="info"
                size="sm"
                onClick={() => {
                    const temp = [...compareRules];
                    temp.push({});

                    setCompareRules(temp);
                }}
            >
                <Add />
            </Button>
            <Button
                type="button"
                color="danger"
                size="sm"
                onClick={() => {
                    const temp = [...compareRules];
                    temp.splice(temp.length - 1, 1);

                    setCompareRules(temp);
                }}
            >
                <Remove />
            </Button>
        </Contain>
    );
}
