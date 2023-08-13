import { React, useEffect, useState, useRef } from "react";
import { IoSendSharp } from "react-icons/io5";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineEmojiEmotions } from "react-icons/md";

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
  const [EmojiGif, setEmojiGif] = useState(true);
  const [showEmojiPickerContainer, setShowEmojiPickerContainer] =
    useState(false);

  const handleTextChange = (e) => {
    setChatText(e.target.value);
  };

  const toggleEmojiPicker = (val) => {
    setShowEmojiPickerContainer(val);
  };

  const toggleTray = (val) => {
    setEmojiGif(val);
  };

  const handleEmojiClick = (emoji) => {
    setChatText(String(chatText + emoji));
    input.current.focus();
  };

  const handleGifClick = (gif) => {
    selectedGif === gif ? setSelectedGif("") : setSelectedGif(gif);
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
      <div
        className={`${
          showEmojiPickerContainer ? "emoji-gif-container" : "hidden"
        }`}
      >
        <div className="emoji-gif-content">
          <div
            className={`${EmojiGif ? null : "hidden"}`}
            style={{ height: "100%" }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              showEmojiPickerContainer={showEmojiPickerContainer}
              EmojiGif={EmojiGif}
            />
          </div>

          {!EmojiGif && showEmojiPickerContainer && (
            <GifPicker
              onGifClick={handleGifClick}
              selectedGif={selectedGif}
              setSelectedGif={setSelectedGif}
            />
          )}
        </div>
        <div className="emoji-gif-selector-tray">
          <button
            className="input-buttons"
            type="button"
            onClick={() => {
              toggleTray(true);
            }}
          >
            <span>
              <MdOutlineEmojiEmotions />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => {
              toggleTray(false);
            }}
          >
            <span>
              <HiOutlineGif />
            </span>
          </button>
        </div>
      </div>

      <button
        className="input-buttons"
        type="button"
        onClick={() => {
          toggleEmojiPicker(!showEmojiPickerContainer);
        }}
      >
        <span>
          <MdOutlineEmojiEmotions />
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
    </form>
  );
}
