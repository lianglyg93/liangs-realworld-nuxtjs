export default {
  router: {
    extendRoutes(routes, resolve) {
      routes.splice(0);
      routes.push(
        ...[
          {
            path: "/",
            component: resolve(__dirname, "pages/LayoutPage"),
            children: [
              {
                path: "",
                name: "home",
                component: resolve(__dirname, "pages/HomePage"),
              },
            ],
          },
        ]
      );
    },
  },
};
