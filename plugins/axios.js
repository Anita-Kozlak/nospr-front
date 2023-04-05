export default function ({ $axios, app }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  });

  api.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      // config.url += '?XDEBUG_SESSION_START=INTELI'
      config.url += "";
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    },
  );

  // api.defaults.post['content-type'] = 'application/json'
  // Set baseURL to something different

  // api.setBaseURL("https://api.inspektor.nfm.wroclaw.pl");
  api.setBaseURL("https://nospr-back.herokuapp.com");

  // Inject to context as $api
  inject("api", api);
}
