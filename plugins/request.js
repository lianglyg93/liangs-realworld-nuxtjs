import axios from "axios";

export const request = axios.create({
  baseURL: "https://conduit.productionready.io",
});

export default ({ store, redirect }) => {
  request.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      const { userInfo } = store.state;
      if (userInfo) {
        config.headers.Authorization = `Token ${userInfo.token}`;
      }
      return config;
    },
    function(errMsg) {
      // Do something with request error
      return Promise.reject(errMsg);
    }
  );
  request.interceptors.response.use(
    function(response) {
      console.log(response);
      // Do something with response data
      return response;
    },
    function(errMsg) {
      const { response } = errMsg;
      if (errMsg.response.status === 401) {
        redirect("/login");
        return;
      }
      // redirect("/sorry");
      return Promise.reject(errMsg.response?.status, errMsg);
    }
  );
};
