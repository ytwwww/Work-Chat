import React from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const styles = (theme) => ({
  link: {
    textDecoration: "none",
  },
  paper: {
    marginTop: 24,
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 4,
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  avatar: {
    margin: 8,
    backgroundColor: theme.palette.primary.light,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 8,
  },
  submit: {
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0,
    // margin: theme.spacing(3, 0, 2),
  },
});

class Register extends React.Component {
  state = {
    loading: false,
    redirect: false,
    username: "",
    password: "",
    fullName: "",
    jobTitle: "",
    helperText: "",
  };

  onInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  onLogin() {
    this.props.app.setState({
      loading: true,
    });
    const newUser = {
      username: this.state.username,
      password: this.state.password,
      fullName: this.state.fullName,
      jobTitle: this.state.jobTitle,
    };
    axios
      .post("/api/users", newUser)
      .then((res) => {
        this.props.history.push("/chat");
        // newUser._id = res._id;
        // const newPeople = this.props.app.people;
        // newPeople.push(newUser);
        this.props.app.setState({
          _id: res._id,
          loggedin: true,
          loading: false,
          // people: newPeople,
        });
        this.setState({ password: "" });
      })
      .catch((err) => {
        // console.log(err);
        this.setState({
          password: "",
          helperText: "User not found. Please try again.",
        });
        this.props.app.setState({
          loading: false,
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container justify="flex-start">
            <Link className={classes.link} to={"/"}>
              {"< Return to Home"}
            </Link>
          </Grid>
          <br />
          <Avatar className={classes.avatar}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              error={this.state.helperText !== ""}
              onChange={this.onInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={this.state.password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={this.state.helperText !== ""}
              helperText={this.state.helperText}
              onChange={this.onInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={this.state.fullName}
              name="fullName"
              label="Full Name"
              type="fullName"
              id="fullName"
              autoComplete="fullName"
              error={this.state.helperText !== ""}
              helperText={this.state.helperText}
              onChange={this.onInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={this.state.jobTitle}
              name="jobTitle"
              label="Job Title"
              type="jobTitle"
              id="jobTitle"
              autoComplete="jobTitle"
              error={this.state.helperText !== ""}
              helperText={this.state.helperText}
              onChange={this.onInputChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={
                this.state.username === "" || this.state.password === ""
              }
              onClick={() => this.onLogin()}
            >
              Register
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles)(Register));
