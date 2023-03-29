<template>
  <div>
    <div id="div_background" class="page-header">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="buttons">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out />
    </div>

    <div class="section-info m-auto d-block py-4">
      <info-section
        type="warning"
        icon="now-ui-icons users_single-02"
        title="Imię i Nazwisko"
        :description="fullName"
      />
      <info-section
        type="warning"
        icon="now-ui-icons ui-1_email-85 "
        title="Email"
        :description="$store.state.user.email"
      />
      <info-section
        type="warning"
        icon="now-ui-icons media-2_note-03"
        title="Zespół"
        description="Narodowa Orkiestra Symfoniczna Polskiego Radia"
      />
      <info-section
        type="warning"
        icon="now-ui-icons ui-2_settings-90"
        title="Zmień hasło"
        class="col-sm change-password"
        description="Kliknij aby zmienić hasło"
        @click.native="openModal"
      />
      <info-section
        type="warning"
        icon="now-ui-icons ui-2_chat-round"
        title="Powiadomienia SMS"
        notification="true"
        class="col-sm"
        description="Możesz włączyć lub wyłączyć powiadomienia SMS"
      />
      <div class="d-flex justify-content-center">
        <n-switch
          v-model="smsNotification"
          v-on:input="toggleNotification"
          on-text="ON"
          off-text="OFF"
        ></n-switch>
      </div>
      </div>
    <modal :show.sync="showModal" headerClasses="justify-content-center">
      <div class="section-info2 m-auto d-block">
        <div class="container">
          <h4 slot="header" class="title title-up">Zmień hasło</h4>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <input
                v-bind:type="[showPasswordOld ? 'text' : 'password']"
                v-model="user.passwordOld"
                id="password"
                name="password"
                class="form-control"
                placeholder="Stare hasło"
                :class="{
                  'is-invalid': submitted && $v.user.passwordOld.$error,
                }"
              />
              <span
                class="input-group-text change-type-icon"
                @click="showPasswordOld = !showPasswordOld"
              >
                <i
                  class="fa"
                  :class="[showPasswordOld ? 'fa-eye' : 'fa-eye-slash']"
                  aria-hidden="true"
                ></i>
              </span>
              <div
                v-if="submitted && $v.user.passwordOld.$error"
                class="invalid-feedback"
              >
                <span v-if="!$v.user.passwordOld.required"
                  >Hasło jest wymagane.</span
                >
                <span v-if="!$v.user.passwordOld.minLength"
                  >Hasło musi mieć conajmniej 7 znaków.</span
                >
              </div>
            </div>
            <div class="form-group">
              <input
                v-bind:type="[showPasswordNew ? 'text' : 'password']"
                v-model="user.password"
                id="password"
                name="password"
                class="form-control"
                placeholder="Nowe hasło"
                :class="{ 'is-invalid': submitted && $v.user.password.$error }"
              />
              <span
                class="input-group-text change-type-icon"
                @click="showPasswordNew = !showPasswordNew"
              >
                <i
                  class="fa"
                  :class="[showPasswordNew ? 'fa-eye' : 'fa-eye-slash']"
                  aria-hidden="true"
                ></i>
              </span>
              <div
                v-if="submitted && $v.user.password.$error"
                class="invalid-feedback"
              >
                <span v-if="!$v.user.password.required"
                  >Hasło jest wymagane.</span
                >
                <span v-if="!$v.user.password.minLength"
                  >Hasło musi mieć conajmniej 7 znaków.</span
                >
              </div>
            </div>
            <div class="form-group">
              <input
                v-bind:type="[showPasswordConfirm ? 'text' : 'password']"
                v-model="user.confirmPassword"
                id="confirmPassword"
                name="confirmPassword"
                class="form-control"
                placeholder="Powtórz hasło"
                :class="{
                  'is-invalid': submitted && $v.user.confirmPassword.$error,
                }"
              />
              <span
                class="input-group-text change-type-icon"
                @click="showPasswordConfirm = !showPasswordConfirm"
              >
                <i
                  class="fa"
                  :class="[showPasswordConfirm ? 'fa-eye' : 'fa-eye-slash']"
                  aria-hidden="true"
                ></i>
              </span>
              <div
                v-if="submitted && $v.user.confirmPassword.$error"
                class="invalid-feedback"
              >
                <span v-if="!$v.user.confirmPassword.required" class="d-block"
                  >Hasło jest wymagane.</span
                >
                <span v-if="!$v.user.confirmPassword.sameAsPassword"
                  >Hasła musza być takie same.</span
                >
              </div>
            </div>
            <button class="btn">Zapisz</button>
          </form>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Button from "../components/Button.vue";
import InfoSection from "../components/InfoSection.vue";
import FormGroupInput from "../components/Inputs/formGroupInput.vue";
import Modal from "../components/Modal.vue";
import SignOut from "../components/SignOut.vue";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { Switch } from "@/components";

export default {
  components: {
    InfoSection,
    SignOut,
    Button,
    Modal,
    [Switch.name]: Switch,
    [FormGroupInput.name]: FormGroupInput,
  },
  data() {
    return {
      selectedTeam: this.$store.state.user.team,
      teams: [],
      active: false,
      showModal: false,
      showPasswordOld: false,
      showPasswordNew: false,
      showPasswordConfirm: false,
      submitted: false,

      user: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      smsNotification: this.$store.state.user.smsNotification,
    };
  },
  validations: {
    user: {
      passwordOld: { required, minLength: minLength(6) },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs("password") },
    },
  },
  mounted() {
    this.loadTeams();
  },
  computed: {
    fullName() {
      return `${this.$store.state.user.name} ${this.$store.state.user.surname}`;
    },
    teamName() {
      switch (this.$store.state.user.team) {
        case "1":
          return "Narodowa Orkiestra Symfoniczna Polskiego Radia";
      }
    },
  },
  methods: {
    async toggleNotification(value) {
      await this.$api.post("user/toggle-notifications", {
        sms_notification: value,
      });
      this.$store.commit("user/toggleNotification", value);
    },
    openModal() {
      this.showModal = true;
    },
    async handleSubmit(e) {
      this.submitted = true;

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        await this.$api.post("user/change-password", {
          old_password: this.user.passwordOld,
          new_password: this.user.password,
          confirm_password: this.user.confirmPassword,
        });
        this.showModal = false;
        this.$toast.success("Twoje hasło zostało zmienione");
      } catch (error) {
        this.$toast.error("Niepoprawne hasło");
      }
    },
    async activeUser(e) {
      this.active = true;
      try {
        await this.$api.post("/user/activate/" + this.$store.state.user.id, {
          active: this.active,
          team: e.target.value,
        });
        this.$store.commit("user/updateTeam", e.target.value);
        this.$toast.success("Zmieniono zespół");
      } catch (e) {
        this.$toast.error("Error. Spróbój ponownie");
      }
    },
    async loadTeams() {
      const response = await this.$api.get("teams");
      this.teams = response.data.teams;
    },
  },
};
</script>
<style lang="scss" scoped>
.info {
  font-size: 11px;
}
.section-info {
  margin-top: 40px !important;
}
.section-info2 {
  position: relative;
}
.input-group {
  border: 1px solid grey;
  border-radius: 30px;
}
.input-group-text {
  position: absolute;
  padding: 0 !important;
  right: 20px;
  top: 9px;
}
.change-password {
  cursor: pointer;
}
.change-type-icon {
  border: none !important;
}
</style>
