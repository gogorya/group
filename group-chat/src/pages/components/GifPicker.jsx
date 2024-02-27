import React from "react";
import { useState, useEffect, useRef } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import "./GifPicker.css";

import { fetchGif } from "../apiRoutes";
import { postUserInfo } from "../../auth";

export default function GifPicker({ onGifClick, toggleTray }) {
  const mediumGif = useRef(new Map());
  const searchMediumGif = useRef(new Map());

  const next = useRef("");
  const searchNext = useRef("");
  const searchGifText = useRef("");
  const timer = useRef();

  const [gifs, setGifs] = useState([]);
  const [searchGifs, setSearchGifs] = useState([]);

  const handleSearchGifTextState = (e) => {
    searchGifText.current = e.target.value;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSearchGifs([]);
      searchMediumGif.current.clear();
      if (e.target.value !== "") {
        fetchGifs();
        // console.log(e.target.value);
      }
    }, 700);
  };

  const handleGifClick = (e) => {
    onGifClick(mediumGif.current.get(e.target.src));
  };

  const searchHandleGifClick = (e) => {
    onGifClick(searchMediumGif.current.get(e.target.src));
  };

  const fetchGifs = () => {
    postUserInfo(fetchGif, {
      next: searchGifText.current === "" ? next.current : searchNext.current,
      searchGifText: searchGifText.current,
    })
      .then((data) => {
        if (searchGifText.current === "") {
          setGifs((prev) => [...prev, ...data.urls]);
          next.current = data.next_value;
          for (let i = 0; i < data.urls.length; i++) {
            mediumGif.current.set(data.urls[i].url, data.urls[i].url_med);
          }
        } else {
          setSearchGifs((prev) => [...prev, ...data.urls]);
          searchNext.current = data.next_value;
          for (let i = 0; i < data.urls.length; i++) {
            searchMediumGif.current.set(data.urls[i].url, data.urls[i].url_med);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const rootElement = document.getElementById("root");
    const targetElement = document.getElementById("targetElement");
    const options = {
      root: rootElement,
      threshold: 0,
      rootMargin: "0px",
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (searchGifText.current === "" || searchMediumGif.current.size > 10) {
          fetchGifs();
        }
      }
    }, options);
    observer.observe(targetElement);

    return () => {
      observer.unobserve(targetElement);
    };
  }, []);

  const loadGifs = (search = false) => {
    let res = [];
    let arr = search ? searchGifs : gifs;

    for (let i = 0; i < arr.length; i++) {
      res.push(
        <div className="gif" key={i}>
          <div
            className="img-shadow-div"
            style={{
              minWidth: `${arr[i]["dim"][0]}px`,
              minHeight: `${arr[i]["dim"][1]}px`,
            }}
          >
            <img
              alt=""
              onClick={search ? searchHandleGifClick : handleGifClick}
              loading="lazy"
              src={arr[i]["url"]}
            ></img>
          </div>
        </div>
      );
    }
    return res;
  };

  return (
    <div className="gif-box">
      <div className="gif-nav">
        <input
          placeholder="Search Tenor"
          onChange={handleSearchGifTextState}
          id="tenorInput"
        />
        <button
          className="input-buttons"
          type="button"
          onClick={() => {
            toggleTray();
          }}
        >
          <span>
            <MdOutlineEmojiEmotions />
          </span>
        </button>
      </div>
      <div className="gifs">
        {searchGifText.current.length === 0 ? (
          <>{loadGifs()}</>
        ) : (
          <>{loadGifs(true)}</>
        )}
        {/* <button onClick={fetchGifs} type="button">click</button> */}
        <div id="targetElement"></div>
      </div>
    </div>
  );
}
