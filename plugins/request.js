import axios from "axios";

export const request = axios.create({
  baseURL: "https://conduit.productionready.io",
});

export default ({ store }) => {
  request.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      const { userInfo } = store.state;
      if (userInfo) {
        config.headers.Authorization = `Token ${userInfo.token}`;
      }
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};
