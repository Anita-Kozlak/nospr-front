export default function ({ store, redirect, route, $api }) {
  // If the user is not authenticated
  if (!store.state.user.isLogged) {
    if (

      route.fullPath !== "/user/login" &&
      route.fullPath !== "/verification" &&
      route.fullPath  !== "/new-password" &&
      route.fullPath  !== "/new-password/" + route.params.code
    ) {
      const token = localStorage.getItem("token");
      if (token) {
        $api.setToken(token, "Bearer");
        store.dispatch("user/check");
      } else {
        return redirect("/user/login");
      }
    }
  }
}