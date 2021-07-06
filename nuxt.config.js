/*
 * @Author: liangs
 * @Date: 2021-07-02 18:25:13
 * @LastEditors: liangs
 * @LastEditTime: 2021-07-05 14:18:27
 * @Description: file content
 */
export default {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.splice(0);
      routes.push(
        ...[
          {
            path: "/",
            component: resolve(__dirname, "pages/Layout"),
            children: [
              {
                path: "",
                name: "home",
                component: resolve(__dirname, "pages/Home/"),
              },
              {
                path: "/login",
                name: "login",
                component: resolve(__dirname, "pages/Login/"),
              },
              {
                path: "/register",
                name: "register",
                component: resolve(__dirname, "pages/Login/"),
              },
              {
                path: "/profile/:username",
                name: "profile",
                component: resolve(__dirname, "pages/Profile/"),
              },
              {
                path: "/editor",
                name: "editor",
                component: resolve(__dirname, "pages/Editor/"),
              },
              {
                path: "/settings",
                name: "settings",
                component: resolve(__dirname, "pages/Settings/"),
              },
              {
                path: "/article/:slug",
                name: "article",
                component: resolve(__dirname, "pages/Article"),
              },
            ],
          },
        ]
      );
    },
  },
};