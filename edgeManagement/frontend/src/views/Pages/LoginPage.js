import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
// import LockOutline from "@material-ui/icons/LockOutline";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [userId, setUserId] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const history = useHistory();
  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="ID"
                  id="firstname"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: userId,
                    onChange: (e) => setUserId(e.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: passwd,
                    onChange: (e) => setPasswd(e.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button
                  color="rose"
                  simple
                  size="lg"
                  block
                  onClick={() => {
                    if (userId === "admin" && passwd === "admin") {
                      sessionStorage.setItem("is_login", "true");
                      history.go("/");
                    } else alert("잘못된 ID 및 비밀번호입니다.");
                  }}
                >
                  Let{"'"}s Go
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
