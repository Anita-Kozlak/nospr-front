export const state = () => ({
  id: "",
  role: "admin",
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
  token: "",
  team: "",
  smsNotification: "",
  isLogged: false,
});

export const mutations = {
  updateTeam(state, payload) {
    state.team = payload;
  },
  toggleNotification(state, payload) {
    state.smsNotification = payload;
  },
  login(state, payload) {
    state.id = payload.id;
    state.role = payload.role;
    state.email = payload.email;
    state.name = payload.name;
    state.surname = payload.surname;
    state.phoneNumber = payload.phone;
    state.team = payload.team;
    state.token = payload.token;
    state.smsNotification = payload.sms_notification;
    state.isLogged = true;
  },
  register(state, payload) {
    state.name = payload.name;
    state.surname = payload.surname;
    state.email = payload.email;
    state.phoneNumber = payload.phoneNumber;
  },
  logout(state, payload) {
    state.id = "";
    state.role = "";
    state.email = "";
    state.name = "";
    state.surname = "";
    state.phoneNumber = "";
    state.token = "";
    state.smsNotification = false;
    state.isLogged = false;
  },
};

export const actions = {
  logout({ commit }) {
    commit("logout");
    localStorage.removeItem("token");
    this.$router.push("/user/login");
  },
  check({ commit }) {
    this.$api
      .get("/user/auth-check")
      .then((response) => {
        commit("login", response.data);
      })
      .catch((error) => {
        this.$router.push("/user/login");
      });
  },
};
