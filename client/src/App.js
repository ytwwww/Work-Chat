import React from "react";
import axios from "axios";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { Backdrop, CircularProgress } from "@material-ui/core";
import {
  Route,
  Switch,
  BrowserRouter,
  Redirect,
  withRouter,
} from "react-router-dom";
import Login from "../src/components/Login";
import Register from "../src/components/Register";
import Chat from "../src/components/Chat";
import Home from "../src/components/Home";

const theme = createTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "medium",
      },
    },
  },
});

class App extends React.Component {
  state = { loading: false, convos: [], people: [], user: null };

  componentDidMount() {
    this.setState({ loading: true });
    axios
    .get("/api/users/check-session")
    .then((res) => {
      // console.log("check session", res.data);
      this.setState({ loggedin: true, user: res.data });
      axios
        .get("/api/convos/multiple")
        .then((res) => {
          this.setState({
            convos: res.data.convos,
            recipients: res.data.recipients,
          });
          this.setState({ loading: false });
        })
        .catch((err) => {
          // console.log(err);
          this.setState({ loading: false });
        });
    })
    .catch((err) => {
      // console.log(err);
      this.setState({ loading: false });
    });
    axios
      .get("/api/users")
      .then((res) => {
        this.setState({ people: res.data });
      })
      .catch((err) => {
        // console.log(err);
        this.setState({ loading: false });
      });

  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Backdrop open={this.state.loading} style={{ zIndex: "1500" }}>
          <CircularProgress style={{ color: "white" }} />
        </Backdrop>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <Home />
                </div>
              )}
            />
            <Route
              exact
              path="/chat"
              render={() => (
                <div>
                  <Chat
                    convos={this.state.convos}
                    people={this.state.people}
                    user={this.state.user}
                    recipients={this.state.recipients}
                    app={this}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/login"
              render={() => (
                <div>
                  <Login app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/register"
              render={() => (
                <div>
                  <Register app={this} />
                </div>
              )}
            />
            <Redirect from="*" to="/" />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
