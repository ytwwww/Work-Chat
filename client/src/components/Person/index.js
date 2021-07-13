import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

const Person = (props) => {
  return (
    <ListItem button>
      <ListItemIcon>
        <Avatar>{props.fullName[0]}</Avatar>
      </ListItemIcon>
      <ListItemText
        primary={props.fullName}
        secondary={props.jobTitle}
      ></ListItemText>
    </ListItem>
  );
};

export default Person;
