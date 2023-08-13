const { userModel } = require("../model");

const checkAuth = async (req, res) => {
  if (req.session.username) {
    res.status(200).send({ isLog: true, username: req.session.username });
  } else {
    res.status(200).send({ isLog: false });
  }
};

const logout = async (req, res) => {
  req.session.destroy(function (error) {});
  res.status(200).send({ isLog: false });
};

const userRegister = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    console.log("Data receive failed", req.body);
    return res.status(400).send("Data receive failed");
  }

  userModel
    .find({
      username: data.username,
    })
    .then((foo) => {
      if (foo.length) {
        res
          .status(200)
          .send({ regStat: "Username already registered.", isLog: false });
      } else {
        const usernameReg = /^[A-Z]{1,1}[A-za-z]{1,25}$/;
        if (!usernameReg.test(data.username)) {
          res.status(200).send({
            regStat:
              "First character should be uppercase with atmost 25 characters.",
            isLog: false,
          });
        } else {
          if (data.password != data.confirmPassword) {
            res
              .status(200)
              .send({ regStat: "The passwords do not match.", isLog: false });
          } else if (data.password.length < 8 || data.password.length > 25) {
            res.status(200).send({
              regStat: "Password length should be 8-25 characters.",
              isLog: false,
            });
          } else {
            const user = new userModel({
              username: data.username,
            });
            user.password = user.generatePassword(data.password);
            user
              .save()
              .then((data) => {
                req.session.username = data.username;
                res
                  .status(200)
                  .send({ regStat: "User registered", isLog: true });
              })
              .catch((error) => {
                console.log(error);
                res
                  .status(400)
                  .send({ regStat: "User register failed", isLog: false });
              });
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const userLogin = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    console.log("Data receive failed", req.body);
    return res.status(400).send("Data receive failed");
  }

  userModel
    .find({
      username: data.username,
    })
    .then((foo) => {
      if (foo.length) {
        if (foo[0].verifyPassword(data.password)) {
          req.session.username = data.username;
          res.status(200).send({ logStat: "Logged In", isLog: true });
        } else {
          res
            .status(200)
            .send({ logStat: "Incorrect password.", isLog: false });
        }
      } else {
        res
          .status(200)
          .send({ logStat: "Username does not exist.", isLog: false });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  userRegister,
  userLogin,
  checkAuth,
  logout,
};
