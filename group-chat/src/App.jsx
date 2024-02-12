import { React, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Protected from "./Protected";
import Block from "./pages/components/Block";

export default function App() {
  const [isDark, setIsDark] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      setIsDark(event.matches);
    });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <Protected>
              <Chat isDark={isDark} setIsDark={setIsDark} />
            </Protected>
          }
        />
        <Route
          path="*"
          element={
            <Block>
              <h2 style={{ color: "var(--main-blue)", marginTop: "200px" }}>
                Error 404: Not Found
              </h2>
              <Link className="link-tag" to={"/login"}>
                Go back
              </Link>
            </Block>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
