import { useEffect, React } from "react";
import { useNavigate } from "react-router-dom";

import { Authentication } from "../../Auth";
import "./Block.css";

export default function Block({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    Authentication().then((data) => {
      if (data.isLog) {
        localStorage.setItem("username", data.username);
        navigate("/chat");
      }
    });
  }, [navigate]);
  return <div className="block">{children}</div>;
}
