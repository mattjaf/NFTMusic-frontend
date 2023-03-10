let fs = require("fs");
let axios = require("axios");

let songs = [];
let durations = [];
let ipfsArray = [];

const MORALIS_API_KEY = process.env.REACT_MORALIS_API_KEY


for (let i = 0; i < songs.length; i++) {
  ipfsArray.push({
    path: `metadata/${i}.json`,
    content: {
      image: `ipfs://xxx`, //xxx = hash
      name: songs[i],
      animation_url: `ipfs://xxx/`, //xxx = hash
      duration: durations[i],
      artist: "",
      year: ""
    },
  });
}

axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArray, {
  headers: {
    "X-API-KEY":
      MORALIS_API_KEY,
    "Content-Type": "application/json",
    accept: "application/json",
  },
})
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error);
  });
