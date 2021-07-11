import React from "react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
} from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import ForumIcon from "@material-ui/icons/Forum";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const items = [{name: "Messages", icon: <ForumIcon />}]
class Bar extends React.Component {
  render() {
    return (
        <AppBar position="sticky">
          <Toolbar>
            <Grid justify="space-between" container>
              <Grid item>
                <Link to={"/Messages"}>
                  <Tooltip title="Messages">
                    <IconButton color="secondary">
                      {/* <Badge badgeContent={this.props.favNum} color="secondary"> */}
                      <Badge badgeContent={0}>
                        <ForumIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </Grid>

              {/* <Grid item>
                <Link to={"/"}>
                  <Tooltip title="Home">
                    <IconButton color="inherit">
                      <StorefrontIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Grid>

              <Grid item>
                <Link to={"/cart"}>
                  <Tooltip title="Shopping Cart">
                    <IconButton color="inherit">
                      <Badge badgeContent={this.props.num} color="secondary">
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </Grid> */}
            </Grid>
          </Toolbar>
        </AppBar>
    );
  }
}

export default Bar;
