export default async function forseUpdate(context, err, firstTime = true) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const worker of registrations) {
        worker.update();
        console.log("Service worker:", worker);
      }
    });
  }
  setTimeout(() => forseUpdate(context, err, false), 5000);
}
