const axios = require("axios");

const request = axios.create({
  baseURL: "https://conduit.productionready.io",
});


export default request;