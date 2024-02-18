import React, { /*useCallback,*/ useEffect, useRef, useState } from "react";
import {
  MdOutlineAccessTime,
  MdOutlineGifBox,
  MdOutlineEmojiEmotions,
  MdOutlineEmojiNature,
  MdOutlineEmojiFoodBeverage,
  MdOutlineEmojiTransportation,
  MdOutlineEmojiEvents,
  MdOutlineEmojiObjects,
  MdOutlineEmojiSymbols,
  MdOutlineEmojiFlags,
} from "react-icons/md";

import emojiData from "../../data/final_emoji.json";
import "./EmojiPicker.css";

export default function EmojiPicker({
  onEmojiClick,
  showEmojiPickerContainer,
  emojiGif,
  toggleTray,
}) {
  const searchInput = useRef(0);
  const recents = useRef([]);
  const refs = useRef([]);
  // const emojiScrollTimer = useRef(undefined);
  // const scrollUp = useRef(true);
  // const prevScrollPos = useRef(-1);
  const emojiScrollBox = useRef(0);
  for (let i = 0; i < 9; i++) {
    refs.current[i] = React.createRef(0);
  }

  const [searching, setSearching] = useState(false);
  const [searchObjects, setSearchObjects] = useState([]);
  // const [stickyNav, setStickyNav] = useState(true);

  const categoryMapping = new Map([
    ["Recents", 0],
    ["Smileys & People", 1],
    ["Animals & Nature", 2],
    ["Food & Drink", 3],
    ["Travel & Places", 4],
    ["Activities", 5],
    ["Objects", 6],
    ["Symbols", 7],
    ["Flags", 8],
  ]);

  useEffect(() => {
    const check = localStorage.getItem("recents");
    if (check && check !== JSON.stringify(recents.current.toReversed())) {
      recents.current = JSON.parse(check).toReversed();
    }
    setSearching(false);
    refs.current[0].current?.scrollIntoView();
    searchInput.current.value = "";
    // setStickyNav(true);
    // scrollUp.current = true;
    setSearchObjects([]);
  }, [showEmojiPickerContainer, emojiGif]);

  const handleCategoryClick = (n) => {
    setSearching(false);
    searchInput.current.value = "";
    setSearchObjects([]);
    refs.current[n].current?.scrollIntoView({
      behavior: "auto",
    });
  };

  const handleEmojiClick = (e) => {
    onEmojiClick(String.fromCodePoint(parseInt(e["unified"], 16)));
    let temp = JSON.parse(localStorage.getItem("recents")) || [];
    if (temp) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]["unified"] === e["unified"]) {
          temp.splice(i, 1);
        }
      }
    }
    temp.push(e);
    while (temp.length >= 25) temp.shift();
    localStorage.setItem("recents", JSON.stringify(temp));
  };

  const searchEmojis = (e) => {
    if (e.target.value) {
      setSearching(true);
      const filterEmoji = emojiData.filter((obj) => {
        return (
          obj["name"].includes(e.target.value.toUpperCase()) ||
          obj["short_name"].includes(e.target.value) ||
          obj["short_names"].includes(e.target.value)
        );
      });
      setSearchObjects(filterEmoji);
    } else {
      setSearching(false);
    }
  };

  // const throttle = useCallback((callback, wait) => {
  //   if (emojiScrollTimer.current) {
  //     return;
  //   }
  //   emojiScrollTimer.current = setTimeout(() => {
  //     callback();
  //     emojiScrollTimer.current = undefined;
  //   }, wait);
  // }, []);

  // const toggleScroll = (val) => {
  //   if (scrollUp.current !== val) {
  //     setStickyNav(val);
  //     scrollUp.current = val;
  //   }
  // };

  // const handleScroll = useCallback(() => {
  //   const currScrollPos = emojiScrollBox.current.scrollTop;
  //   if (
  //     prevScrollPos.current >= 0 &&
  //     Math.abs(prevScrollPos.current - currScrollPos) < 50
  //   ) {
  //     currScrollPos > prevScrollPos.current
  //       ? toggleScroll(false)
  //       : toggleScroll(true);
  //   }
  //   prevScrollPos.current = currScrollPos > 0 ? currScrollPos : 0;
  // }, []);

  // useEffect(() => {
  //   const ele = emojiScrollBox.current;
  //   ele.addEventListener("scroll", (e) => {
  //     throttle(handleScroll, 50);
  //   });
  //   return () => {
  //     ele.removeEventListener("scroll", () => {});
  //   };
  // }, [throttle, handleScroll]);

  return (
    <div className="emoji-box">
      <div className="emoji-nav">
        <div className="emoji-nav-search">
          <input
            placeholder="Search Emoji"
            onChange={searchEmojis}
            ref={searchInput}
          />
          <button
            className="input-buttons"
            type="button"
            onClick={() => {
              toggleTray();
            }}
          >
            <span>
              <MdOutlineGifBox />
            </span>
          </button>
        </div>
        <div className="emoji-nav-category">
          {recents.current.length !== 0 && (
            <button
              className="input-buttons"
              type="button"
              onClick={() => handleCategoryClick(0)}
            >
              <span>
                <MdOutlineAccessTime />
              </span>
            </button>
          )}
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(1)}
          >
            <span>
              <MdOutlineEmojiEmotions />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(2)}
          >
            <span>
              <MdOutlineEmojiNature />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(3)}
          >
            <span>
              <MdOutlineEmojiFoodBeverage />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(4)}
          >
            <span>
              <MdOutlineEmojiTransportation />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(5)}
          >
            <span>
              <MdOutlineEmojiEvents />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(6)}
          >
            <span>
              <MdOutlineEmojiObjects />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(7)}
          >
            <span>
              <MdOutlineEmojiSymbols />
            </span>
          </button>
          <button
            className="input-buttons"
            type="button"
            onClick={() => handleCategoryClick(8)}
          >
            <span>
              <MdOutlineEmojiFlags />
            </span>
          </button>
        </div>
      </div>
      <div className="emoji-body">
        <div className="emoji-scroll-box" ref={emojiScrollBox}>
          {recents.current.length !== 0 && (
            <div className="emoji-grid">
              <span
                className="category"
                ref={refs.current[categoryMapping.get("Recents")]}
              >
                Recents
              </span>

              {recents.current.map((ele, ind, arr) => {
                return (
                  <React.Fragment key={ind}>
                    <span
                      style={{
                        backgroundPosition: `${
                          arr[ind]["sheet_x"] * -66 - 1
                        }px ${arr[ind]["sheet_y"] * -66 - 1}px`,
                      }}
                      onClick={() => handleEmojiClick(arr[ind])}
                      className="emoji-element"
                    ></span>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          <div className="emoji-grid">
            {emojiData.map((ele, ind, arr) => {
              return (
                <React.Fragment key={ind}>
                  {arr[ind - 1] === undefined ||
                  arr[ind]["category"] !== arr[ind - 1]["category"] ? (
                    <span
                      className="category"
                      ref={
                        refs.current[categoryMapping.get(arr[ind]["category"])]
                      }
                    >
                      {arr[ind]["category"]}
                    </span>
                  ) : null}
                  <span
                    style={{
                      backgroundPosition: `${arr[ind]["sheet_x"] * -66 - 1}px ${
                        arr[ind]["sheet_y"] * -66 - 1
                      }px`,
                    }}
                    onClick={() => handleEmojiClick(arr[ind])}
                    className="emoji-element"
                  ></span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div>
          {searching && (
            <>
              <div className="fill-div">
                <div className="search-div emoji-grid">
                  {searchObjects.length ? (
                    searchObjects.map((ele, ind, arr) => {
                      return (
                        <React.Fragment key={ind}>
                          <span
                            style={{
                              backgroundPosition: `${
                                arr[ind]["sheet_x"] * -66 - 1
                              }px ${arr[ind]["sheet_y"] * -66 - 1}px`,
                            }}
                            onClick={() => handleEmojiClick(arr[ind])}
                            className="emoji-element"
                          ></span>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <span className="category">Not found</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
