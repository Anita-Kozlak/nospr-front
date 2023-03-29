<template>
  <div class="page-header signup-page page-opacity">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="content">
      <div class="col-md-5 ml-auto mr-auto">
        <img v-lazy="'img/nospr_logo.jpg'" alt="" />
        <card type="login" plain>
          <fg-input
            class="no-border input-lg"
            addon-left-icon="now-ui-icons ui-1_email-85"
            type="email"
            placeholder="Email"
            @keyup="validateEmail"
            v-model="email"
          >
          </fg-input>
          <p class="form-error" v-if="!validation.email.isValid">
            {{ validation.email.message }}
          </p>
          <div class="d-flex field-password">
            <fg-input
              class="no-border input-lg input-password"
              addon-left-icon="now-ui-icons objects_key-25"
              :type="passwordFieldType"
              placeholder="Hasło"
              @keyup="validatePassword"
              v-model="password"
              @keyup.enter="loginUser"
            >
            </fg-input>
            <button
              class="show-password"
              type="password"
              @click="switchVisibility"
            ></button>
          </div>
          <p class="form-error mt-2" v-if="!validation.password.isValid">
            {{ validation.password.message }}
          </p>
          <div
            class="text-light mt-3 forget-password"
            @click="showModal = true"
          >
            Zapomniałeś hasła?
          </div>

          <template slot="raw-content">
            <div class="card-footer text-center">
              <button
                id="loginUserButton"
                class="btn btn-default btn-round btn-lg btn-block"
                @click="loginUser"
              >
                Zaloguj się
              </button>
            </div>
            <div class="pull-left">
              <h6>
                <a class="link footer-link text-white">Nie masz konta?</a>
              </h6>
            </div>
            <div class="pull-right">
              <h6>
                <router-link
                  v-popover:popover1
                  class="link footer-link"
                  to="register"
                >
                  Zarejestruj się
                </router-link>
              </h6>
            </div>
          </template>
        </card>
      </div>
    </div>
    <modal :show.sync="showModal" headerClasses="justify-content-center">
      <h4 slot="header" class="title">Zapomniałem hasła</h4>
      <div class="form-group">
        <input
          type="email"
          class="form-control"
          placeholder="Email"
          v-model="emailSendNewPassword"
        />
      </div>
      <button class="btn" @click="changePassword">Wyślij</button>
    </modal>
    <modal :show.sync="showModalInfo" headerClasses="justify-content-center">
      <p>Jeśli podany e-mail jest prawidłowy, otrzymasz link aktywacyjny.</p>
    </modal>
  </div>
</template>
<script>
import { Card, Button, FormGroupInput } from "@/components";
import Modal from "../../components/Modal.vue";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

export default {
  name: "login",
  layout: "default-no-footer",
  components: {
    Card,
    Modal,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput,
  },
  middleware: ['version'],
  mounted() {
    let userAgentString = navigator.userAgent;

    // Detect Safari and Chrome agent
    let safariAgent = userAgentString.indexOf("Safari") > -1;
    let chromeAgent = userAgentString.indexOf("Chrome") > -1;

    // Discard Safari since it also matches Chrome
    if ((chromeAgent) && (safariAgent)) safariAgent = false;
    this.isSafari = safariAgent;
  },
  data() {
    return {
      isSafari : false,
      showModal: false,
      showModalInfo: false,
      email: "",
      emailSendNewPassword: "",
      password: "",
      passwordFieldType: "password",
      validation: {
        email: {
          isValid: false,
          message: "",
        },
        password: {
          isValid: false,
          message: "",
        },
      },
    };
  },
  methods: {
    async loginUser() {
      this.validateEmail();
      this.validatePassword();
      if (this.validation.email.isValid && this.validation.password.isValid) {
        this.$api
          .post("/user/auth", {
            login: this.email,
            password: this.password,
            is_safari: this.isSafari
          })
          .then((response) => {
            localStorage.setItem("token", response.data.token);
            this.$api.setToken(response.data.token, "Bearer");

            if (typeof(Notification) !== 'undefined' && Notification?.permission !== 'denied') {
              this.$pusher.setData(response.data.token, response.data.id)
              this.$pusher.init();
            }

            this.$store.commit("user/login", response.data);
            this.$router.push("/");
          })
          .catch((error) => {
            console.log(error);
            //Error
            if (!error.response) {
              // network error
              this.$toast.error("Brak internetu");
            } else {
              this.$toast.error("Nieprawidłowy login lub/i hasło");
            }
          });
      }
    },
    validateEmail() {
      if (!this.email.length) {
        this.validation.email.isValid = false;
        this.validation.email.message = "To pole jest obowiązkowe.";
      } else if (
        !this.email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
      ) {
        this.validation.email.isValid = false;
        this.validation.email.message = "Nieprawidłowy email.";
      } else {
        this.validation.email.isValid = true;
        this.validation.email.message = "";
      }
    },
    validatePassword() {
      if (!this.password.length) {
        this.validation.password.isValid = false;
        this.validation.password.message = "To pole jest obowiązkowe.";
      } else if (this.password.length < 7) {
        this.validation.password.isValid = false;
        this.validation.password.message = "Minimum 7 znaków.";
      } else {
        this.validation.password.isValid = true;
        this.validation.password.message = "";
      }
    },
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    async changePassword() {
      try {
        await this.$api.post("user/reset-password-request", {
          email: this.emailSendNewPassword,
        });
        this.showModal = false;
        this.showModalInfo = true;
      } catch (error) {
        this.$toast.error("Niepoprawny email");
      }
    },
  },
};
</script>
<style scoped>
.page-opacity {
  background-color: rgba(0, 0, 0, 0.6);
}

.forget-password {
  cursor: pointer;
}
a {
  text-decoration: none;
  color: white;
}
</style>
