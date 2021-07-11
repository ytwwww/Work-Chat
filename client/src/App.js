import React from "react";
import axios from "axios";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
// import PostList from "../src/components/PostList";
// import Footer from "../src/components/Footer";
// import Info from "../src/components/Info";
import Nav from "../src/components/Nav";
import Person from "../src/components/Person";

// import Login from "../src/components/Login";
// import Special from "../src/components/Special";
// import Admin from "../src/components/Admin";
// import Menu from "../src/components/Menu";

const theme = createMuiTheme({
  // palette: {
  //   primary: {
  //     main: "#005742",
  //   },
  //   error: {
  //     main: "#d32f2f",
  //   },
  // },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "medium",
      },
    },
  },
});

class App extends React.Component {
  state = { loading: false, posts: [], special: {} };

  componentDidMount() {
    axios
      .get("/admins/check-session")
      .then((res) => {
        // console.log(res.data);
        this.setState({ loggedin: true });
      })
      .catch((err) => {
        // console.log(err);
      });
    axios
      .get("/posts")
      .then((res) => {
        this.setState({ posts: res.data });
      })
      .catch((err) => {
        // console.log(err);
      });
    axios
      .get("/special")
      .then((res) => {
        // console.log(res.data);
        this.setState({ special: res.data });
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  render() {
    const nav = (
      <span>
        <Nav />
      </span>
    );
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
                  {nav}
                  <Person initial="AW" name="Amy Wang" title="Chef"/>
                  <Person initial="AW" name="Amy Wang" title="Chef"/>
                  <Person initial="AW" name="Amy Wang" title="Chef"/>
                  <Person initial="AW" name="Amy Wang" title="Chef"/>
                  <Person initial="AW" name="Amy Wang" title="Chef"/>
                  <Person initial="AW" name="Amy Wang" title="Chef"/>
                  {/* {this.state.special && this.state.special.public ? (
                    <Special special={this.state.special} />
                  ) : null}
                  <Info />
                  <PostList posts={this.state.posts} />
                  <Footer /> */}
                </div>
              )}
            />
            {/* <Route
              exact
              path="/login"
              render={() => (
                <div>
                  {bar}
                  <Login app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard"
              render={() => (
                <div>
                  {bar}
                  <Admin loggedin={this.state.loggedin} app={this} />
                </div>
              )}
            /> */}
            <Redirect from="*" to="/" />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
