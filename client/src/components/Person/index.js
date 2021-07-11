// import Avatar from '@material-ui/core/Avatar';
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Avatar } from "@material-ui/core";

const styles = (theme) => ({
  paper: {
    padding: 24,
    marginTop: 5,
    margin: 10,
    width: 700,
    '&:hover': {
        transform: "scale(1.02)"
     },
  },
});

class Person extends React.Component {
  render() {
    const { classes, initial, name, title } = this.props;
    return (
      <Grid container justify="center">
        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid item>
              <Avatar>{initial}</Avatar>
            </Grid>
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <strong>{name}</strong>
                </Grid>
                <Grid item>{title}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(Person);
