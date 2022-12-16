import React from "react";
import { 
  Grid,
  Typography, 
  TextField, 
  Box 
} from "@mui/material"; // Button
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { cyan, blue } from "@mui/material/colors";
// import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(2),
      width: "100%",
    },
  },
  styleTitle: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 40,
  },
  styleKeys: {
    marginLeft: "6px",
    marginRight: "6px",
    height: "40px",
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  styleLine1: {
    width: "10px",
    marginTop: "10px",
    height: "10px",
    borderTop: "1px solid #bdbdbd",
  },
  styleLine2: {
    width: "100%",
    marginTop: "0px",
    height: "10px",
    borderTop: "1px solid #bdbdbd",
  },
  styleDeps: {
    marginLeft: 50,
  },
  styleContainer: {
    display: "flex",
  },
  styleSubmit: {
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      light: blue["100"],
      main: blue["800"],
      dark: blue["900"],
      contrastText: '#fff',
    },
    secondary: {
      light: blue["100"],
      main: blue["700"],
      dark: blue["900"],
      contrastText: '#000',
    },
  },
});

// const jsonData = manifestJson;
const FileModelInfo = ({ jsonData, setJsonData, nameVersionCheck }) => {
  const classes = useStyles();

  const handleInputchange = (e) => {
    // const pullName = e.target.name;
    // console.log("pullName:", pullName);
    const name = e.target.name.split("::")[0];
    const type = e.target.name.split("::")[1];
    const depth = e.target.name.split("::")[2];
    if (type === "string") {
      if (depth === "1") {
        setJsonData({ ...jsonData, [name]: e.target.value });
      } else if (depth === "2") {
        const d1 = name.split("|")[0];
        const d2 = name.split("|")[1];
        let tmpObj = { ...jsonData };
        tmpObj[d1][d2] = e.target.value;
        setJsonData(tmpObj);
      } else if (depth === "3") {
        const d1 = name.split("|")[0];
        const d2 = name.split("|")[1];
        const d3 = name.split("|")[2];
        let tmpObj = { ...jsonData };
        tmpObj[d1][d2][d3] = e.target.value;
        setJsonData(tmpObj);
      }
    } else if (type === "array") {
      const idx = e.target.name.split("::")[3];
      if (depth === "1") {
        const tmpData = jsonData;
        const array = tmpData[name];
        array.splice(idx, 1, e.target.value);
        setJsonData({ ...jsonData, [name]: array });
      } else if (depth === "2") {
        const d1 = name.split("|")[0];
        const d2 = name.split("|")[1];
        let tmpObj = { ...jsonData };
        const array = tmpObj[d1][d2];
        array.splice(idx, 1, e.target.value);
        tmpObj[d1][d2] = array;
        setJsonData(tmpObj);
      }
    }
  };

  // key 텍스트 컬러
  const keyTypo = (key, depth) => {
    let depthColor;
    if (depth === 1) {
      depthColor = theme.palette.primary.main; // deepPurple 700
    } else if (depth === 2) {
      depthColor = theme.palette.primary.main; // indigo 700
    } else if (depth === 3) {
      depthColor = theme.palette.primary.main; // blue 700
    }
    return (
      <Typography component="div">
        <Box fontWeight="fontWeightRegular" fontSize={16} color={depthColor}>
          {key}
        </Box>
      </Typography>
    );
  };

  const textFieldColor = (depth) => {
    if (depth === 1) {
      return "primary"
    } else if (depth === 2) {
      return "primary"
    } else if (depth === 3) {
      return "primary"
    }
  }

  const getString = (obj, key, idx, depth, depthKey) => {
    return (
      <div key={`${key}_${idx}`}>
        {keyTypo(key, depth)}
        <TextField
          color={textFieldColor(depth)}
          fullWidth
          id="outlined-size-small"
          defaultValue={obj[key] || "no data"}
          variant="outlined"
          size="small"
          name={
            depthKey
              ? `${depthKey}::string::${depth}`
              : `${key}::string::${depth}`
          }
          onChange={handleInputchange}
        />
      </div>
    );
  };

  const getObject = (obj, key, idx, depth) => {
    const obj2 = obj[key];
    let depthKey = key;
    // console.log("depthKey1", key);
    return (
      <div key={`${key}_${idx}`}>
        {keyTypo(key, depth)}
        <div className={classes.styleLine2}></div>
        <div className={classes.styleDeps}>
          {Object.keys(obj2).map((key2, idx2) => {
            const depthKey2 = depthKey + "|" + key2;
            // console.log("depthKey2:", depthKey2);
            if (Array.isArray(obj2[key2])) {
              return getArray(obj2, key2, idx2, 2, depthKey2);
            } else if (typeof obj2[key2] === "object") {
              return getObject2(obj2, key2, idx2, 2, depthKey2);
            } else if (typeof obj2[key2] === "string") {
              return getString(obj2, key2, idx2, 2, depthKey2);
            }
          })}
        </div>
      </div>
    );
  };

  const getObject2 = (obj, key, idx, depth, depthKey) => {
    const obj2 = obj[key];
    return (
      <div key={`${key}_${idx}`}>
        {keyTypo(key, depth)}
        <div className={classes.styleLine2}></div>
        <div className={classes.styleDeps}>
          {Object.keys(obj2).map((key2, idx2) => {
            const depthKey3 = depthKey + "|" + key2;
            // console.log("depthKey3:", depthKey3);
            return getString(obj2, key2, idx2, 3, depthKey3);
          })}
        </div>
      </div>
    );
  };

  const getArray = (obj, key, idx, depth, depthKey) => {
    const obj2 = obj[key];
    return (
      <div key={`${key}_${idx}`}>
        {keyTypo(key, depth)}
        {Object.keys(obj2).map((key2, idx2) => {
          return (
            <div key={`${key2}_${idx2}`}>
              <TextField
                fullWidth
                id="outlined-size-small"
                defaultValue={obj2[key2] || "no data"}
                variant="outlined"
                size="small"
                name={
                  depthKey
                    ? `${depthKey}::array::${depth}::${idx2}`
                    : `${key}::array::${depth}::${idx2}`
                }
                onChange={handleInputchange}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const objectTrue = () => {
    return (
      <ThemeProvider theme={theme}>
        {Object.keys(jsonData).map((key1, idx1) => {
          if (!nameVersionCheck) {
            if (key1 === "modelName" || key1 === "modelVersion") {
            } else {
              if (Array.isArray(jsonData[key1])) {
                return getArray(jsonData, key1, idx1, 1);
              } else if (typeof jsonData[key1] === "object") {
                return getObject(jsonData, key1, idx1, 1);
              } else if (typeof jsonData[key1] === "string" || typeof jsonData[key1] === "number") {
                return getString(jsonData, key1, idx1, 1);
              }
            }
          } else {
            if (Array.isArray(jsonData[key1])) {
              return getArray(jsonData, key1, idx1, 1);
            } else if (typeof jsonData[key1] === "object") {
              return getObject(jsonData, key1, idx1, 1);
            } else if (typeof jsonData[key1] === "string" || typeof jsonData[key1] === "number") {
              return getString(jsonData, key1, idx1, 1);
            }
          }

        })}
      </ThemeProvider>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <div>{objectTrue()}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default FileModelInfo;
