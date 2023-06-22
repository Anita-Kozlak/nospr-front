import * as PusherPushNotifications from "@pusher/push-notifications-web";

export default function ({ app }, inject) {
  let tokenProvider = null;
  let client = null;
  let clientReady = false;
  let userId = null;
  let userToken = null;

  const init = () => {
    if (userId !== null && userToken !== null) {
      window.navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        tokenProvider = new PusherPushNotifications.TokenProvider({
          url: "https://api.inspektor.softart.online/user/get-beams-token",

          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        client = new PusherPushNotifications.Client({
          instanceId: "95497c8d-ec23-4657-bf27-325aee32f0b2",
          serviceWorkerRegistration: serviceWorkerRegistration,
        });

        clientReady = true;
        console.log("Notification client should be ready");
      });
    }
  };

  const setData = (token, id) => {
    userToken = token;
    userId = id;
  };

  const start = () => {
    if (clientReady) {
      client
        .start()
        .then(() => client.setUserId(userId, tokenProvider))
        .then(
          () => console.log("Successfully registered and subscribed!"),
          (clientReady = false),
        )
        .catch("error", console.error);
    } else {
      console.log("Notification client is not ready yet");
    }
  };

  // Inject to context as $api
  inject("pusher", {
    init: init,
    setData: setData,
    start: start,
    isClientReady: () => clientReady,
  });
}
