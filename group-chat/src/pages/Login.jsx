import { useState, React } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginRoute } from "./apiRoutes";
import Block from "./components/Block";
import { postUserInfo } from "../auth";

export default function Landing() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });

  const [logStatus, setLogStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: userDetails.username,
      password: userDetails.password,
    };
    postUserInfo(loginRoute, data).then((data) => {
      if (data.isLog) {
        localStorage.setItem("username", userDetails.username);
        navigate("/chat");
      } else {
        setLogStatus(data.logStat);
      }
    });
  };

  const handleUsernameChange = (e) => {
    setUserDetails({
      ...userDetails,
      username: e.target.value,
    });
  };
  const handlePasswordChange = (e) => {
    setUserDetails({
      ...userDetails,
      password: e.target.value,
    });
  };

  return (
    <Block>
      <form className="log-reg">
        <div className="upper-section">
          <p className="logo">Group</p>
          <hr />
          <input
            // className="usernameInput"
            placeholder="Username"
            onChange={(e) => handleUsernameChange(e)}
            value={userDetails.username}
          />
          <input
            type="password"
            // className="passwordInput"
            placeholder="Password"
            onChange={(e) => handlePasswordChange(e)}
            value={userDetails.password}
          />
          <p className="log-status">{logStatus}</p>
        </div>
        <div className="lower-section">
          <button
            // className="startChatButton"
            onClick={handleSubmit}
            disabled={
              userDetails.username === "" || userDetails.password === ""
            }
          >
            Log in
          </button>
          <hr />
          <p className="switch">
            Don't have an account?{" "}
            <Link className="link-tag" to={"/"}>
              Register
            </Link>{" "}
          </p>
        </div>
      </form>
    </Block>
  );
}
