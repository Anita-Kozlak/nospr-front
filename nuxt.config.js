const { getEntrySpanEnd } = require("@fullcalendar/vue");

module.exports = {
  ssr: false,
  /*
   ** Headers of the page
   */
  router: {
    base: "/",
    linkExactActiveClass: "active",
    scrollBehavior: (to) => {
      if (to.hash) {
        return { selector: to.hash };
      } else {
        return { x: 0, y: 0 };
      }
    },
    extendRoutes(routes, resolve) {
      routes.push({
        // name: "new-password-code",
        path: "/new-password/:code",
        component: resolve(__dirname, "pages/new-password/"),
      });
    },
  },
  head: {
    htmlAttrs: {
      lang: "pl",
    },
    title: "Inspektor NOSPR",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1.0, shrink-to-fit=no",
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Montserrat:400,700,200|Open+Sans+Condensed:700",
      },
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.0.6/css/all.css",
      },
      {
        rel: "stylesheet",
        href: "https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css",
        crossorigin: "anonymous",
      },
    ],
    script: [],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~/assets/sass/now-ui-kit.scss", "~/assets/sass/demo.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/globalDirectives.js", ssr: false },
    { src: "~/plugins/element-ui.js" },
    { src: "~/plugins/now-ui-kit" },
    "~/plugins/axios",
    "~/plugins/pusher",
    { src: "~/plugins/full-calendar", ssr: false },
    // { src: "~/plugins/sw-update.js", mode: "client" },
    //{ src: "~/plugins/pwa-update.js", mode: "client" },
    // { src: "~/plugins/sw.client.js", mode: "client" },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/pwa",
    "@nuxtjs/axios",
    ["@nuxtjs/toast", { duration: 4000, draggable: true }],
    "@nuxtjs/moment",
  ],
  moment: {
    locales: ["pl"],
  },

  /*
   ** Build configuration
   */

  build: {
    extractCSS: process.env.NODE_ENV === "production",
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk",
          },
        ],
      ],
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  pwa: {
    meta: {
      mobileAppIOS: true,
      theme_color: "grey",
    },
    workbox: {
      importScripts: ["https://js.pusher.com/beams/service-worker.js"],
      /* workbox options */
      //enabled: true,
      offline: true,
      skipWaiting: true,
      workboxOptions: { skipWaiting: true },
    },
    manifest: {
      lang: "pl",
      useWebmanifestExtension: "false",
      name: "NOSPR Inspektor",
      short_name: "NOSPR Inspektor",
      description: "",
      icons: [
        {
          src: "/icon_64x64.png",
          sizes: "64x64",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon_120x120.png",
          sizes: "120x120",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon_144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon_152x152.png",
          sizes: "152x152",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon_192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon_384x384.png",
          sizes: "384x384",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon_512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
  },
};
