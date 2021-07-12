const mongoose = require("mongoose");

const ConvoSchema = new mongoose.Schema({
  // store ids of 2 people
  participants: { type: [mongoose.Types.ObjectId], required: true },
  // store chat history
  history: [
    {
      from: { type: mongoose.Types.ObjectId, required: true },
      content: { type: String, required: true },
      time: { type: Date, default: Date.now },
    },
  ],
  lastMessage: {
    from: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now },
  },
  readBy: { type: [mongoose.Types.ObjectId] },
});

ConvoSchema.statics.findByTwoUsers = function (userA, userB) {
  return Convo.findOne({ participants: { $all: [userA, userB] } }).then(
    (convo) => {
      if (!convo) {
        return Promise.reject();
      } else {
        return convo;
      }
    }
  );
};

const Convo = mongoose.model("Convo", ConvoSchema);

module.exports = { Convo };
