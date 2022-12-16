import React from "react";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles(() => ({
//   styleInput: {
//     width: "100%",
//     height: "40px",
//     border: "1px solid #512da8",
//     borderRadius: "5px",
//     display: "flex",
//     alignItems: "center",
//     paddingLeft: "12px",
//   },
// }));

const InputCustom = (props) => {
  // const classes = useStyles();
  // eslint-disable-next-line react/prop-types
  const { depthColor, children } = props;
  return (
    <div
      style={{
        width: "100%",
        height: "40px",
        border: `1px solid ${depthColor}`,
        // backgroundColor: depthColor,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "12px",
      }}
    >
      {children}
    </div>
  );
};

export default InputCustom;
