import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { socket } from "../../socket";
import InputSection from "./InputSection";
import { postUserInfo, Authentication, handleLogout } from "../../auth";
import { postMessage, getMessage } from "../apiRoutes";
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
    Authentication()
      .then((data) => {
        if (!data.isLog) {
          handleLogout().catch((error) => {
            console.log(error);
          });
          navigate("/login");
        } else {
          localStorage.setItem("username", data.username);
        }
      })
      .catch((error) => {
        console.log(error);
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
      date: String,
      gif: selectedGif,
    };
    modifyTime(hold);
    const msg = [...messages];
    msg.push(hold);
    setMessages((prev) => [...prev, hold]);

    postUserInfo(postMessage, { chatText, selectedGif })
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    socket.emit("sendMessage", {
      username: currUser,
      message: chatText,
      gif: selectedGif,
    });
  };

  const modifyTime = async (obj) => {
    const tt = new Date(obj.time);
    let dispTime = "",
      dispDate = "";
    switch (tt.getMonth()) {
      case 0:
        dispDate += "Jan ";
        break;
      case 1:
        dispDate += "Feb ";
        break;
      case 2:
        dispDate += "Mar ";
        break;
      case 3:
        dispDate += "Apr ";
        break;
      case 4:
        dispDate += "May ";
        break;
      case 5:
        dispDate += "Jun ";
        break;
      case 6:
        dispDate += "Jul ";
        break;
      case 7:
        dispDate += "Aug ";
        break;
      case 8:
        dispDate += "Sep ";
        break;
      case 9:
        dispDate += "Oct ";
        break;
      case 10:
        dispDate += "Nov ";
        break;
      case 11:
        dispDate += "Dec ";
        break;
      default:
        break;
    }
    dispDate += String(tt.getDate()) + " " + String(tt.getFullYear()) + " ";
    obj.date = dispDate;
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
    postUserInfo(getMessage)
      .then((data) => {
        for (let i = 0; i < data.messagePackage.length; i++) {
          modifyTime(data.messagePackage[i]);
        }
        setMessages(data.messagePackage);
      })
      .catch((error) => {
        console.log(error);
      });
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
      {/* <div className="date-detail date-detail-absolute">
        <span>Hiii</span>
      </div> */}
      <div className="chat-message">
        {messages.map((ele, ind, arr) => {
          return (
            <React.Fragment key={ind}>
              {arr[ind - 1] !== undefined &&
              arr[ind].date === arr[ind - 1].date ? null : (
                <div className="date-detail">
                  <span>{arr[ind].date}</span>
                </div>
              )}
              <div
                ref={scrollRef}
                className={`message-box${
                  arr[ind].username === currUser ? " out" : " in"
                }${
                  arr[ind + 1] === undefined ||
                  arr[ind].username !== arr[ind + 1].username ||
                  arr[ind].time !== arr[ind + 1].time
                    ? " last"
                    : ""
                }`}
              >
                {arr[ind].username === currUser ||
                (arr[ind - 1] !== undefined &&
                  arr[ind].username === arr[ind - 1].username) ? null : (
                  <div className="user-detail">
                    <span>{arr[ind].username}</span>
                  </div>
                )}
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
                  {arr[ind + 1] !== undefined &&
                  arr[ind].username === arr[ind + 1].username &&
                  arr[ind].time === arr[ind + 1].time ? null : (
                    <span className="time-detail">{arr[ind].time}</span>
                  )}
                </div>
              </div>
            </React.Fragment>
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
