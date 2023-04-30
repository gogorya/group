import { useState, React } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerRoute } from "./apiRoutes";
import Block from "./components/Block";
import { postUserInfo } from "../Auth";

export default function Landing() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [regStatus, setRegStatus] = useState("");

  const handleSubmit = (e) => {
    const data = {
      username: userDetails.username,
      password: userDetails.password,
      confirmPassword: userDetails.confirmPassword,
    };
    postUserInfo(registerRoute, data).then((data) => {
      if (data.isLog) {
        localStorage.setItem("username", userDetails.username);
        navigate("/chat");
      } else {
        setRegStatus(data.regStat);
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
  const handleconfirmPasswordChange = (e) => {
    setUserDetails({
      ...userDetails,
      confirmPassword: e.target.value,
    });
  };

  return (
    <Block>
      <div className="log-reg">
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
          <input
            type="password"
            className="passwordConfirmInput"
            placeholder="Confirm Password"
            onChange={(e) => handleconfirmPasswordChange(e)}
            value={userDetails.confirmPassword}
          />
          <p className="log-status">{regStatus}</p>
        </div>
        <div className="lower-section">
          <button
            // className="startChatButton"
            onClick={handleSubmit}
            disabled={
              userDetails.username === "" ||
              userDetails.password === "" ||
              userDetails.confirmPassword === ""
            }
          >
            Register
          </button>
          <hr />
          <p className="switch">
            Already registered?{" "}
            <Link className="link-tag" to={"/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </Block>
  );
}
