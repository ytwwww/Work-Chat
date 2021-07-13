import React from "react";
import { withRouter, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
    fontSize: "8vw",
  },
  button: {
    textTransform: "none",
    fontSize: "3vw",
    margin: theme.spacing(3, 0, 2),
  },
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <h1 className={classes.header}>Work Chat</h1>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={7}
            >
              <Grid item>
                <Button
                  size="large"
                  component={Link}
                  to="/login"
                  className={classes.button}
                  type="button"
                  variant="contained"
                  color="primary"
                >
                  Log In
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="large"
                  component={Link}
                  to="/register"
                  className={classes.button}
                  type="button"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Home));
