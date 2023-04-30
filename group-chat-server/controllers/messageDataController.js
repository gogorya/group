const { messageModel } = require("../model");

const postMessage = async (req, res) => {
  if (req.session.username) {
    const { data } = req.body;
    if (!data) {
      console.log("Message receive failed", req.body);
      return res.status(400).send("Message receive failed");
    }
    const msg = new messageModel({
      username: req.session.username,
      message: data.chatText,
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
  } else {
    console.log("YO bro, why here");
    res.status(403).send("Access denied by server");
  }
};

const getMessage = async (req, res) => {
  if (req.session.username) {
    const data = [];
    const foo = await messageModel.find({}, "username message createdAt");
    foo.map((it) => {
      data.push({
        username: it.username,
        message: it.message,
        time: it.createdAt,
      });
    });
    // console.log(data);
    res.status(200).send({ messagePackage: data });
  } else {
    console.log("YO bro, why here");
    res.status(403).send("Access denied by server");
  }
};

module.exports = {
  postMessage,
  getMessage,
};
