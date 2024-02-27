import { React } from "react";
import { useNavigate } from "react-router-dom";
import { MdLightMode, MdDarkMode } from "react-icons/md";

import { handleLogout } from "../../auth";
import "./Header.css";

export default function Header({ isDark, setIsDark }) {
  const currentUsername = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleThemeChange = async () => {
    if (isDark) {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    }
    setIsDark(!isDark);
  };

  const handleLogoutfunc = () => {
    handleLogout()
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    navigate("/login");
  };

  return (
    <div className="header">
      <div>
        <p>{currentUsername}</p>
      </div>
      <div className="right-buttons">
        <button onClick={handleThemeChange}>
          <span>{isDark === true ? <MdLightMode /> : <MdDarkMode />}</span>
        </button>
        <button onClick={handleLogoutfunc}>Logout</button>
      </div>
    </div>
  );
}
