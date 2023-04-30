import { React } from "react";

import Block from "./components/Block";
import Header from "./components/Header";
import ChatScreen from "./components/ChatScreen";

export default function Chat({ isDark, setIsDark }) {
  return (
    <Block>
      <Header isDark={isDark} setIsDark={setIsDark} />
      <ChatScreen />
    </Block>
  );
}
