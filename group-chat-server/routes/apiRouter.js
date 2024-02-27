const express = require("express");

const router = express.Router();

const {
  userRegister,
  userLogin,
  checkAuth,
  logout,
} = require("../controllers/userDataController");

const {
  postMessage,
  getMessage,
  checkAuthh,
} = require("../controllers/messageDataController");

const { fetchGif } = require("../controllers/fetchGifController");

router.post("/userLogin", userLogin);
router.post("/userRegister", userRegister);
router.post("/checkAuth", checkAuth);
router.post("/logout", logout);

router.use(checkAuthh);
router.post("/postMessage", postMessage);
router.post("/getMessage", getMessage);

router.post("/fetchGif", fetchGif);

module.exports = router;
