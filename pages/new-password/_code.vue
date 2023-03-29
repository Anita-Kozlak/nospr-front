<template>
  <div>
    <div id="div_background" class="page-header">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="section-info m-auto d-block py-4">
      <div class="container">
        <h4 slot="header" class="title text-center pb-4">Ustaw nowe hasło</h4>
        <form @submit.prevent="handleSubmit" class="form-group">
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
              class="input-group-text show-password-icon change-type-icon"
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
              class="input-group-text change-type-icon show-password-icon"
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
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
import InfoSection from "@/components/InfoSection.vue";
import FormGroupInput from "@/components/Inputs/formGroupInput.vue";
import Modal from "@/components/Modal.vue";
import SignOut from "@/components/SignOut.vue";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
export default {
  components: {
    InfoSection,
    SignOut,
    Button,
    Modal,
    [FormGroupInput.name]: FormGroupInput,
  },
  data() {
    return {
      showModal: false,
      user: {
        password: "",
        confirmPassword: "",
      },
      submitted: false,
      showPasswordNew: false,
      showPasswordConfirm: false,
    };
  },
  validations: {
    user: {
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs("password") },
    },
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
        await this.$api.post("user/reset-password", {
          code: this.$route.params.code,
          new_password: this.user.password,
          confirm_password: this.user.confirmPassword,
        });
        this.$router.push("/user/login");
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.info {
  font-size: 11px;
  width: 54% !important;
}
.section-info {
  margin-top: 40px !important;
  overflow: hidden;
  position: relative;
}

.input-group {
  border: 1px solid grey;
  border-radius: 30px;
}

.show-password-icon {
  position: absolute;
  top: 11px !important;
  right: 17px !important;
  padding: 0 !important;
}
.change-type-icon {
  border: none !important;
}
</style>
