import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListSubheader from "@material-ui/core/ListSubheader";
import Avatar from "@material-ui/core/Avatar";
import Person from "../Person";
import Logoff from "../Logoff";
import axios from "axios";
import Content from "../Content";

const styles = (theme) => ({
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

class Chat extends React.Component {
  state = {
    selected: null,
    newMsg: "",
  };

  onSelect = (convo, receiver) => {
    console.log("onSelect", convo, receiver);
    this.setState({ selected: { convo: convo, receiver: receiver } });
  };

  render() {
    const { classes, user, convos, people, recipients } = this.props;
    return (
      <div>
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={3} className={classes.borderRight}>
            {user ? (
              <List className={classes.profile}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar color="primary">{user.fullName[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={user.fullName}
                    secondary={user.jobTitle}
                  ></ListItemText>
                  <ListItemSecondaryAction>
                    <Logoff />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            ) : null}
            <Divider />
            <List subheader={<ListSubheader>Chats</ListSubheader>}>
              {convos.map((convo) => {
                const receiver = people.filter(
                  (person) => person._id === recipients[convo._id]
                )[0];
                return (
                  <ListItem
                    button
                    key={convo._id}
                    onClick={() => this.onSelect(convo, receiver)}
                  >
                    <ListItemIcon>
                      <Avatar>{receiver.fullName[0]}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          {receiver.fullName}
                          <span className={classes.lighterText}>
                            {" (" + receiver.jobTitle + ")"}
                          </span>
                        </React.Fragment>
                      }
                      secondary={convo.lastMessage.content}
                    ></ListItemText>
                  </ListItem>
                );
              })}
            </List>
            <Divider />
            <List subheader={<ListSubheader>People</ListSubheader>}>
              {people.map((person) => (
                <div key={person._id} onClick={() => this.onSelect([], person)}>
                  <Person
                    fullName={person.fullName}
                    jobTitle={person.jobTitle}
                  />
                </div>
              ))}
            </List>
          </Grid>
          <Grid item xs={9}>
            {this.state.selected ? (
              <Content
                user={user}
                people={people}
                convo={this.state.selected.convo}
                receiver={this.state.selected.receiver}
                chatState={this}
                app={this.props.app}
              />
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Chat);
