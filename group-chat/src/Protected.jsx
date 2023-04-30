import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Block from "./pages/components/Block";
import { Authentication } from "./Auth";

export default function Auth({ children }) {
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Authentication().then((data) => {
      setIsLoaded(true);
      if (!data.isLog) {
        navigate("/login");
      }
    });
  }, [navigate]);
  return isLoaded ? (
    children
  ) : (
    <Block>
      <h2 style={{ color: "var(--main-blue-dark)" }}>Please wait...</h2>
    </Block>
  );
}
