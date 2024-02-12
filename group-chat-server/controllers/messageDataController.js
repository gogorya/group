const { messageModel } = require("../model");

const checkAuthh = async (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(403).send({ isLog: false });
  }
};

const postMessage = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    console.log("Message receive failed", req.body);
    return res.status(400).send("Message receive failed");
  }
  if (data.chatText === "" && data.selectedGif === "") {
    return res.status(400).send("Message receive failed, empty");
  }
  const msg = new messageModel({
    username: req.session.username,
    message: data.chatText,
    gif: data.selectedGif,
  });
  msg
    .save()
    .then((data) => {
      res.status(200).send({ messageStat: "Message received" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ messageStat: "Message receive failed" });
    });
};

const getMessage = async (req, res) => {
  const data = [];
  const foo = await messageModel.find({}, "username message gif createdAt");
  foo.map((it) => {
    data.push({
      username: it.username,
      message: it.message,
      time: it.createdAt,
      gif: it.gif,
    });
  });
  // console.log(data);
  res.status(200).send({ messagePackage: data });
};

module.exports = {
  postMessage,
  getMessage,
  checkAuthh,
};
