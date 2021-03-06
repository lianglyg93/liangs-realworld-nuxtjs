export default {
  head: {
    title: "realWorld",
  },
  router: {
    linkActiveClass: "active",
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
              {
                name: "404",
                path: "*",
                component: resolve(__dirname, "pages/Error/"),
              },
            ],
          },
        ]
      );
    },
  },
  server: {
    port: 8000, // default: 3000
    host: "0.0.0.0", // default: localhost,
  },
  plugins: ["~/plugins/request.js", "~/plugins/filter.js"],
  loading: "~/components/loading.vue",
};
