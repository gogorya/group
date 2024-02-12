import { useRef, useState, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { socket } from "../../socket";
import InputSection from "./InputSection";
import { postUserInfo, Authentication, handleLogout } from "../../auth";
import { getMessage } from "../apiRoutes";
import { postMessage } from "../apiRoutes";
import "./ChatScreen.css";

export default function ChatScreen() {
  const navigate = useNavigate();
  const scrollRef = useRef();

  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [selectedGif, setSelectedGif] = useState("");
  const [arrivalmessage, setArrivalMessage] = useState({});

  const currUser = localStorage.getItem("username");

  useEffect(() => {
    Authentication().then((data) => {
      if (!data.isLog) {
        handleLogout().catch((error) => {
          console.log(error);
        });
        navigate("/login");
      } else {
        localStorage.setItem("username", data.username);
      }
    });
  }, [messages, selectedGif, arrivalmessage, navigate]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    setChatText("");
    setSelectedGif("");

    const hold = {
      username: currUser,
      message: chatText,
      time: new Date().toISOString(),
      gif: selectedGif,
    };
    modifyTime(hold);
    const msg = [...messages];
    msg.push(hold);
    setMessages((prev) => [...prev, hold]);

    postUserInfo(postMessage, { chatText, selectedGif }).then((data) => {
      // console.log(data);
    });

    socket.emit("sendMessage", {
      username: currUser,
      message: chatText,
      gif: selectedGif,
    });
  };

  const modifyTime = async (obj) => {
    const tt = new Date(obj.time);
    let dispTime = "";
    switch (tt.getMonth()) {
      case 0:
        dispTime += "Jan ";
        break;
      case 1:
        dispTime += "Feb ";
        break;
      case 2:
        dispTime += "Mar ";
        break;
      case 3:
        dispTime += "Apr ";
        break;
      case 4:
        dispTime += "May ";
        break;
      case 5:
        dispTime += "Jun ";
        break;
      case 6:
        dispTime += "Jul ";
        break;
      case 7:
        dispTime += "Aug ";
        break;
      case 8:
        dispTime += "Sep ";
        break;
      case 9:
        dispTime += "Oct ";
        break;
      case 10:
        dispTime += "Nov ";
        break;
      case 11:
        dispTime += "Dec ";
        break;
      default:
        break;
    }
    dispTime += String(tt.getDate()) + " " + String(tt.getFullYear()) + " ";
    dispTime +=
      String(tt.getHours() > 12 ? tt.getHours() - 12 : tt.getHours()) + ":";
    dispTime +=
      String(
        tt.getMinutes() < 10 ? "0" + String(tt.getMinutes()) : tt.getMinutes()
      ) + " ";
    dispTime += tt.getHours() > 11 ? "PM" : "AM";
    obj.time = dispTime;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    (async () => {
      const data = await postUserInfo(getMessage, {});
      for (let i = 0; i < data.messagePackage.length; i++) {
        modifyTime(data.messagePackage[i]);
      }
      setMessages(data.messagePackage);
    })();
  }, []);

  useEffect(() => {
    const eventHandler = (receiveMessage) => {
      // console.log(receiveMessage);
      modifyTime(receiveMessage);
      setArrivalMessage(receiveMessage);
    };
    socket.on("receiveMessage", eventHandler);
    return () => {
      socket.off("receiveMessage", eventHandler);
    };
  }, []);

  useEffect(() => {
    arrivalmessage && setMessages((prev) => [...prev, arrivalmessage]);
  }, [arrivalmessage]);

  return (
    <div className="chat-container">
      <div className="chat-message">
        {messages.map((ele, ind, arr) => {
          return (
            <div
              ref={scrollRef}
              className={`message-box${
                arr[ind].username === currUser ? " out" : " in"
              }${
                arr[ind + 1] === undefined ||
                arr[ind].username !== arr[ind + 1].username
                  ? " last"
                  : ""
              }`}
              key={uuidv4()}
            >
              {arr[ind - 1] !== undefined &&
                (arr[ind].username === arr[ind - 1].username ||
                arr[ind].username === currUser ? null : (
                  <div className="user-detail">
                    <span>{arr[ind].username}</span>
                  </div>
                ))}
              <div className="message">
                {arr[ind].gif === "" ? null : (
                  <img
                    loading="lazy"
                    className="message-gif"
                    src={arr[ind].gif}
                    alt=""
                  />
                )}
                <span>{arr[ind].message}</span>
                <span className="time-detail">{arr[ind].time}</span>
              </div>
            </div>
          );
        })}
      </div>
      <InputSection
        handleInputSubmit={handleInputSubmit}
        chatText={chatText}
        setChatText={setChatText}
        selectedGif={selectedGif}
        setSelectedGif={setSelectedGif}
      />
    </div>
  );
}
