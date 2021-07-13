import React from "react";
import axios from "axios";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withRouter } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

class Logoff extends React.Component {
  // Logout user and redirect to home
  logoff = () => {
    axios
      .get("/api/users/logout")
      .then((res) => {
        console.log("logged out!");
        this.props.app.setState({ loggedin: false });
        this.props.history.push("/");
      })
      .catch((err) => {
        // console.log(err);
        this.props.history.push("/");
      });
  };

  render() {
    return (
      <Tooltip title="Log Off">
        <IconButton edge="end" onClick={() => this.logoff()}>
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

export default withRouter(Logoff);
