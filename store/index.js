/*
 * @Author: liangs
 * @Date: 2021-07-06 17:36:59
 * @LastEditors: liangs
 * @LastEditTime: 2021-07-07 15:20:28
 * @Description: file content
 */
const cookieparser = process.server ? require("cookieparser") : undefined;
export const state = () => {
  return {
    //用户信息
    userInfo: null,
  };
};

export const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data;
  },
};

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let userInfo = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        userInfo = JSON.parse(parsed.userInfo);
      } catch (err) {
        // No valid cookie found
      }
    }
    commit("setUserInfo", userInfo);
  },
};
