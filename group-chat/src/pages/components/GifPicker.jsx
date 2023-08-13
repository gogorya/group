import React from "react";
import { useState, useEffect, useRef } from "react";

import { MdOutlineClose } from "react-icons/md";
import "./GifPicker.css";

export default function GifPicker({ onGifClick, selectedGif, setSelectedGif }) {
  const tinyGif = useRef(new Map());
  const searchTinyGif = useRef(new Map());

  const next = useRef("");
  const searchNext = useRef("");
  const searchGifText = useRef("");
  const loadMore = useRef(false);

  const [gifs, setGifs] = useState([]);
  const [searchGifs, setSearchGifs] = useState([]);

  const handleSearchGifTextState = (e) => {
    searchGifText.current = e.target.value;
  };

  const handleGifClick = (e) => {
    onGifClick(tinyGif.current.get(e.target.src));
  };

  const searchHandleGifClick = (e) => {
    onGifClick(searchTinyGif.current.get(e.target.src));
  };

  const fetchGifs = () => {
    var apikey = "AIzaSyAEAw4HtOwdgX2ytsEDnfaj_WlJS0sksd0";
    var clientkey = "my_test_app";
    var lmt = 30;
    var media = "nanogif, tinygif";
    var featured_url =
      "https://tenor.googleapis.com/v2/featured?key=" +
      apikey +
      "&client_key=" +
      clientkey +
      "&limit=" +
      lmt +
      "&pos=" +
      next.current +
      "&media_filter=" +
      media;

    // console.log(featured_url);

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        var response_objects = JSON.parse(xmlHttp.responseText);
        let top_10_gifs = response_objects["results"];
        let urls = [];
        let next_value = "";
        let url, dim;
        for (let i = 0; i < top_10_gifs.length; i++) {
          if (top_10_gifs[i]["media_formats"]["nanogif"]["dims"][1] > 90) {
            continue;
          }
          url = top_10_gifs[i]["media_formats"]["nanogif"]["url"];
          dim = top_10_gifs[i]["media_formats"]["nanogif"]["dims"];
          urls.push({ url, dim });
          tinyGif.current.set(
            top_10_gifs[i]["media_formats"]["nanogif"]["url"],
            top_10_gifs[i]["media_formats"]["tinygif"]["url"]
          );
        }

        next_value = response_objects["next"];
        setGifs((prev) => [...prev, ...urls]);
        next.current = next_value;
      }
    };
    xmlHttp.open("GET", featured_url, true);
    xmlHttp.send(null);
  };

  const searchFetchGifs = () => {
    var apikey = "AIzaSyAEAw4HtOwdgX2ytsEDnfaj_WlJS0sksd0";
    var clientkey = "my_test_app";
    var lmt = 30;
    var media = "nanogif, tinygif";
    var search_url =
      "https://tenor.googleapis.com/v2/search?q=" +
      searchGifText.current +
      "&key=" +
      apikey +
      "&client_key=" +
      clientkey +
      "&limit=" +
      lmt +
      "&pos=" +
      searchNext.current +
      "&media_filter=" +
      media;

    // console.log(search_url);

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        var response_objects = JSON.parse(xmlHttp.responseText);
        let top_10_gifs = response_objects["results"];
        let urls = [];
        let next_value = "";
        let url, dim;
        for (let i = 0; i < top_10_gifs.length; i++) {
          if (top_10_gifs[i]["media_formats"]["nanogif"]["dims"][1] > 90) {
            continue;
          }
          url = top_10_gifs[i]["media_formats"]["nanogif"]["url"];
          dim = top_10_gifs[i]["media_formats"]["nanogif"]["dims"];
          urls.push({ url, dim });
          searchTinyGif.current.set(
            top_10_gifs[i]["media_formats"]["nanogif"]["url"],
            top_10_gifs[i]["media_formats"]["tinygif"]["url"]
          );
        }
        next_value = response_objects["next"];
        setSearchGifs((prev) => [...prev, ...urls]);
        searchNext.current = next_value;
      }
    };
    xmlHttp.open("GET", search_url, true);
    xmlHttp.send(null);
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
        if (loadMore.current) {
          searchFetchGifs(true);
          // console.log("inside search observer", searchGifText.current.length);
        }
        if (searchGifText.current.length === 0) {
          fetchGifs();
          // console.log("inside featured observer", searchGifText.current.length);
        }
      }
    }, options);
    observer.observe(targetElement);

    return () => {
      observer.unobserve(targetElement);
    };
  }, []);

  useEffect(() => {
    let timer;
    const tenorInput = document.getElementById("tenorInput");
    tenorInput.addEventListener("keyup", (e) => {
      loadMore.current = false;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSearchGifs([]);
        searchTinyGif.current.clear();
        if (e.target.value !== "") {
          searchFetchGifs();
          console.log(e.target.value);
          loadMore.current = true;
        }
      }, 500);
    });

    return () => {
      tenorInput.removeEventListener("keyup", () => {});
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
      <div className="gif-nav">
        <input
          placeholder="Search Tenor"
          onChange={handleSearchGifTextState}
          id="tenorInput"
        />
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
