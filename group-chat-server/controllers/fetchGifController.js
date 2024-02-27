const fetchGif = (req, res) => {
  const { data } = req.body;
  var apikey = process.env.TENOR_KEY;
  var clientkey = "my_test_app";
  var lmt = 30;
  var media = "nanogif, mediumgif";
  var featured_url =
    data.searchGifText == ""
      ? "https://tenor.googleapis.com/v2/featured?key=" +
        apikey +
        "&client_key=" +
        clientkey +
        "&limit=" +
        lmt +
        "&pos=" +
        data.next +
        "&media_filter=" +
        media
      : "https://tenor.googleapis.com/v2/search?q=" +
        data.searchGifText +
        "&key=" +
        apikey +
        "&client_key=" +
        clientkey +
        "&limit=" +
        lmt +
        "&pos=" +
        data.next +
        "&media_filter=" +
        media;

  fetch(featured_url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response is not ok");
      }
      return res.json();
    })
    .then((response_objects) => {
      let top_10_gifs = response_objects["results"];
      let urls = [];
      let url, dim;
      for (let i = 0; i < top_10_gifs.length; i++) {
        if (top_10_gifs[i]["media_formats"]["nanogif"]["dims"][1] > 90) {
          continue;
        }
        url = top_10_gifs[i]["media_formats"]["nanogif"]["url"];
        dim = top_10_gifs[i]["media_formats"]["nanogif"]["dims"];
        url_med = top_10_gifs[i]["media_formats"]["mediumgif"]["url"];
        urls.push({ url, dim, url_med });
      }
      res.status(200).send({
        urls: urls,
        next_value: response_objects["next"],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  fetchGif,
};
