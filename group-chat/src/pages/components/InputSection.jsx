import { React, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiLaughingFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

import "./InputSection.css";

export default function InputSection({
  handleInputSubmit,
  chatText,
  setChatText,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTextChange = (e) => {
    setChatText(e.target.value);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji, event) => {
    setChatText(String(chatText + emoji.emoji));
  };

  return (
    <form className="input-form" onSubmit={(e) => handleInputSubmit(e)}>
      <div className="emoji-picker-container">
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            previewConfig={{
              showPreview: false,
            }}
            autoFocusSearch={false}
            height={window.screen.width <= 961 ? "300px" : "450px"}
            width={window.screen.width <= 961 ? "100%" : "350px"}
          />
        )}
      </div>
      <button className="input-buttons" type="button">
        <span>
          <BsEmojiLaughingFill onClick={toggleEmojiPicker} />
        </span>
      </button>

      <input
        className="text-input"
        placeholder="Type a message"
        onChange={handleTextChange}
        value={chatText}
      />
      <button className="input-buttons" disabled={chatText === ""}>
        <span>
          <IoSendSharp />
        </span>
      </button>
    </form>
  );
}
