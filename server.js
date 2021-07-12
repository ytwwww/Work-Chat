"use strict";
const log = console.log;

// for environment variables
require("dotenv").config();

const express = require("express");
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// import the mongoose models
const { User } = require("./models/user");
const { Convo } = require("./models/convo");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");

/*** Session handling **************************************/
// Create a session cookie
app.use(
  session({
    secret: "supersecretchat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
      httpOnly: true,
    },
  })
);

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  log("Authenticating");
  if (!req.session.loggedin) {
    res.status(401).send();
    log("Auth Failed");
    return;
  } else {
    log("Auth Success");
    next();
  }
};

const createConvo = (from, to, content, res) => {
  const message = {
    from: from,
    content: content,
  };
  const convo = new Convo({
    participants: [from, to],
    history: [message],
    lastMessage: message,
    readBy: [from],
  });

  // Save the convo
  convo.save().then(
    (convo) => {
      // add convo id to both users' model
      const users = [from, to];
      const convo_id = convo._id;
      for (let i = 0; i < users.length; i++) {
        User.findById(users[i]).then(
          (user) => {
            const newConvos = user.convos;
            newConvos.unshift(convo_id);
            User.findByIdAndUpdate(users[i], {
              convos: newConvos,
            }).then(
              (user) => {
                log(user);
              },
              (error) => {
                res.status(500).send(error);
              }
            );
          },
          (error) => {
            res.status(500).send(error);
          }
        );
        res.send(convo);
        return;
      }
    },
    (error) => {
      // 400 for bad request
      res.status(400).send(error);
      return;
    }
  );
};

const updateConvo = (id, from, to, content, res) => {
  if (
    !ObjectID.isValid(id) ||
    !ObjectID.isValid(from) ||
    !ObjectID.isValid(to)
  ) {
    res.status(404).send("Invalid ID");
    return;
  }

  Convo.findById(id).then(
    (convo) => {
      const message = { from: from, content: content };
      const newHistory = convo.history;
      newHistory.push(message);
      const fields = {
        history: newHistory,
        lastMessage: message,
        readBy: [from],
      };
      Convo.findByIdAndUpdate(id, fields, { new: true }).then(
        (convo) => {
          res.send(convo);
        },
        (error) => {
          res.status(500).send(error); // server error
        }
      );
    },
    (error) => {
      res.status(500).send(error); // server error
    }
  );
};

// A route to login and create a session
app.post("/api/users/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Use the static method on the User model to find a user
  // by their email and password
  User.findByUsernamePassword(username, password)
    .then((user) => {
      // Add the user's id to the session cookie.
      req.session.loggedin = true;
      req.session._id = user._id;
      log("Logged in");
      res.send({ loggedin: true, _id: user._id });
      return;
    })
    .catch((error) => {
      log("Failed to log in");
      res.status(400).send();
      return;
    });
});

// A route to logout a user
app.get("/api/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      log("Cannot Log out");
      res.status(500).send(error);
      return;
    } else {
      res.send();
      log("Logged out");
      return;
    }
  });
});

// A route to check if a user is logged in on the session cookie
app.get("/api/users/check-session", (req, res) => {
  if (req.session.loggedin) {
    log("session exists");
    res.send({ loggedin: req.session.loggedin, _id: req.session._id });
  } else {
    log("no session");
    res.status(401).send();
  }
});

// {
//   "username": "john",
//   "password": "johnpassword",
//   "fullName": "John Smith",
//   "jobTitle": "Owner"
// }
/** User routes below **/
// A route to create a user
// app.post("/api/users", authenticate, (req, res) => {
app.post("/api/users", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    fullName: req.body.fullName,
    jobTitle: req.body.jobTitle,
    convos: [],
  });

  // Save the user
  user.save().then(
    (user) => {
      res.send(user);
      return;
    },
    (error) => {
      // 400 for bad request
      res.status(400).send(error);
      return;
    }
  );
});

// TODO
// A route to get all users
// app.get("/api/users", authenticate, (req, res) => {
app.get("/api/users", (req, res) => {
  User.find()
    .then((posts) => {
      res.send(posts);
      return;
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error.");
      return;
    });
});

// A route to get convo between 2 users if it exists
app.get("/api/convos/:id1/:id2", (req, res) => {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  Convo.findByTwoUsers(id1, id2)
    .then((convo) => {
      res.send(convo);
    })
    .catch((error) => {
      log("Failed to find convo");
      res.status(404).send();
      return;
    });
});

// A route to get all convos
app.get("/api/convos", (req, res) => {
  Convo.find()
    .then((posts) => {
      res.send(posts);
      return;
    })
    .catch((error) => {
      // log(error);
      res.status(500).send("Internal Server Error.");
      return;
    });
});

/*
a PATCH route to change some properties of a convo
Request Body Expects:
[
    {"op": "replace", "path": "/property", "value": "newValue"}
]
e.g.
[
    {"op": "replace", "path": "/readBy", "value": [some value]},
    {"op": "replace", "path": "/lastMessage", "value": {some value}},
    {"op": "replace", "path": "/history", "value": [some value]}
]
Returned JSON: The updated convo
*/
app.patch("/api/convos/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const from = req.body.from;
  const to = req.body.to;
  const content = req.body.content;
  if (
    !ObjectID.isValid(id) ||
    !ObjectID.isValid(from) ||
    !ObjectID.isValid(to)
  ) {
    res.status(404).send("Invalid ID");
    return;
  }
  const fields = {};
  req.body.map((change) => {
    const property = change.path.substr(1);
    fields[property] = change.value;
  });
  Convo.findByIdAndUpdate(id, fields, { new: true }).then(
    (convo) => {
      res.send(convo);
    },
    (error) => {
      res.status(500).send(error); // server error
    }
  );
});

// A route to (1) update a convo if it exists OR
// (2) create a conversation if it does not exists
app.post("/api/convos", authenticate, (req, res) => {
  const from = req.body.from;
  const to = req.body.to;
  if (!ObjectID.isValid(from) || !ObjectID.isValid(to)) {
    res.status(404).send("Invalid ID");
    return;
  }
  // if (req.session._id !== from) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }
  const content = req.body.content;
  if (req.body.hasOwnProperty("convoID")) {
    updateConvo(convoID, from, to, content, res);
  } else {
    Convo.findByTwoUsers(from, to)
      .then((convo) => {
        updateConvo(convo._id, from, to, content, res);
      })
      .catch((error) => {
        createConvo(from, to, content, res);
      });
  }
});

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(__dirname + "/client/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  const goodPageRoutes = ["/", "/login", "/dashboard"];
  if (!goodPageRoutes.includes(req.url)) {
    // if url not in expected page routes, set status to 404.
    res.status(404);
  }
  // send index.html
  res.sendFile(__dirname + "/client/build/index.html");
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
