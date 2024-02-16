import { React, useEffect, useState, useRef } from "react";
import { IoSendSharp } from "react-icons/io5";
import {
  MdOutlineEmojiEmotions,
  MdOutlineArrowDownward,
  MdOutlineClose,
} from "react-icons/md";

import GifPicker from "./GifPicker";
import EmojiPicker from "./EmojiPicker";
import "./InputSection.css";

export default function InputSection({
  handleInputSubmit,
  chatText,
  setChatText,
  selectedGif,
  setSelectedGif,
}) {
  const input = useRef();
  const [emojiGif, setEmojiGif] = useState(true);
  const [showEmojiPickerContainer, setShowEmojiPickerContainer] =
    useState(false);

  useEffect(() => {
    input.current.addEventListener("focus", (event) => {
      toggleEmojiPicker(false);
    });
  }, []);

  const handleTextChange = (e) => {
    setChatText(e.target.value);
  };

  const toggleEmojiPicker = (val) => {
    setShowEmojiPickerContainer(val);
  };

  const toggleTray = () => {
    setEmojiGif(!emojiGif);
  };

  const handleEmojiClick = (emoji) => {
    setChatText(String(chatText + emoji));
  };

  const handleGifClick = (gif) => {
    setSelectedGif(gif);
    toggleEmojiPicker(false);
    input.current.focus();
  };

  const onFormSubmit = (e) => {
    input.current.focus();
    toggleEmojiPicker(false);
    handleInputSubmit(e);
  };

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <form className="input-form" onSubmit={(e) => onFormSubmit(e)}>
      <div className="input-div">
        <button
          className="input-buttons"
          type="button"
          onClick={() => {
            toggleEmojiPicker(!showEmojiPickerContainer);
          }}
        >
          <span>
            {showEmojiPickerContainer ? (
              <MdOutlineArrowDownward />
            ) : (
              <MdOutlineEmojiEmotions />
            )}
          </span>
        </button>

        <input
          className="text-input"
          placeholder="Type a message"
          onChange={handleTextChange}
          value={chatText}
          ref={input}
        />
        <button
          className="input-buttons"
          disabled={chatText === "" && selectedGif === ""}
        >
          <span>
            <IoSendSharp />
          </span>
        </button>
      </div>
      <div
        className={`${
          showEmojiPickerContainer ? "emoji-gif-container" : "hidden"
        }`}
      >
        <div className="emoji-gif-content">
          <div
            className={`${emojiGif ? null : "hidden"}`}
            style={{ height: "100%" }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              showEmojiPickerContainer={showEmojiPickerContainer}
              emojiGif={emojiGif}
              toggleTray={toggleTray}
            />
          </div>
          {!emojiGif && showEmojiPickerContainer && (
            <GifPicker
              onGifClick={handleGifClick}
              emojiGif={emojiGif}
              toggleTray={toggleTray}
            />
          )}
        </div>
      </div>
      <div>
        {selectedGif !== "" && (
          <div
            className="preview-gif"
            onClick={() => {
              setSelectedGif("");
            }}
          >
            <img src={selectedGif} alt=""></img>
            <button className="input-buttons" type="button">
              <span>
                <MdOutlineClose />
              </span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
