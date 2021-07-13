import React from "react";
import axios from "axios";
import { uid } from "react-uid";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";

const styles = () => ({
  profile: { position: "sticky" },
  chatSection: {
    width: "100%",
    height: "100vh",
  },
  borderRight: {
    height: "100vh",
    overflowY: "auto",
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "80vh",
    overflowY: "auto",
  },
  lighterText: {
    color: "rgba(0, 0, 0, 0.54)",
  },
});

class Content extends React.Component {
  state = {
    newMsg: "",
    recepient: "",
  };

  onInputChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  onSubmit() {
    this.props.app.setState({
      loading: true,
    });
    console.log(this.props.convo._id);
    const msg = {
      //   convoID: this.props.convo._id,
      from: this.props.user._id,
      to: this.props.receiver._id,
      content: this.state.newMsg,
    };
    axios
      .post("/api/convos", msg)
      .then((res) => {
        this.setState({ newMsg: "" });
        this.props.chatState.setState({
          selected: { convo: res.data, receiver: this.props.receiver },
        });
        axios
          .get("/api/convos/multiple")
          .then((res) => {
            this.props.app.setState({
              convos: res.data.convos,
              recipients: res.data.recipients,
              loading: false,
            });
          })
          .catch((err) => {
            // console.log(err);
            this.props.app.setState({ loading: false });
          });
      })
      .catch((err) => {
        this.props.app.setState({
          loading: false,
        });
      });
  }

  render() {
    const { classes, user, convo } = this.props;

    console.log("content", this.props.convo, this.props.user);
    return (
      <div>
        <List className={classes.messageArea}>
          {convo.history
            ? convo.history.map((msg) => {
                return (
                  <div key={uid(msg)}>
                    <ListItem key="1">
                      <Grid container>
                        <Grid item xs={12}>
                          <ListItemText
                            align={
                              user._id.toString() === msg.from.toString()
                                ? "right"
                                : "left"
                            }
                            primary={msg.content}
                          ></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                          <ListItemText
                            align={
                              user._id.toString() === msg.from.toString()
                                ? "right"
                                : "left"
                            }
                            secondary={
                              new Date(msg.time).getHours() +
                              ":" +
                              new Date(msg.time).getMinutes()
                            }
                          ></ListItemText>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </div>
                );
              })
            : null}
        </List>
        <Divider />
        <Grid container style={{ padding: "20px" }}>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              value={this.state.newMsg}
              name="newMsg"
              type="newMsg"
            //   id="newMsg"
              onChange={this.onInputChange}
            />
          </Grid>
          <Grid xs={1} align="right">
            <Fab
              color="primary"
              aria-label="add"
              disabled={this.state.newMsg === ""}
              onClick={() => this.onSubmit()}
            >
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Content));
