<template>
  <div class="page-header mainViewPage position-relative">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="buttons">
      <NuxtLink
        class="navbar btn-signout"
        v-if="$store.state.user.role === 'admin'"
        to="/admin-users"
      >
        Użytkownicy
      </NuxtLink>
      <sign-out></sign-out>
    </div>
    <div class="mainView">
      <NuxtLink to="calendar">
        <h1 class="workPlan view">PLAN PRACY</h1>
      </NuxtLink>
      <NuxtLink to="regulations">
        <h1 class="regulations view">REGULAMINY</h1>
      </NuxtLink>
      <NuxtLink to="materials">
        <h1 class="materials view">Materiały</h1>
      </NuxtLink>
      <NuxtLink to="user-setting">
        <span class="user-setting view">ustawienia konta</span>
      </NuxtLink>
      <!-- <NuxtLink to="/contacts"> -->
      <h1 @click="openModal" class="contact view">
        <span> O aplikacji</span>
      </h1>
      <!-- </NuxtLink> -->
      <span class="reg view"></span>
      <div class="admin view"></div>
      <NuxtLink to="announcements">
        <h1 class="announcementsAll view">Ogłoszenia</h1>
      </NuxtLink>
      <NuxtLink to="chat">
        <h1 class="chat view">CHAT</h1>
      </NuxtLink>
      <div class="availabilityOfWardrobes view">Garderoby</div>
      <div class="availabilityOfRooms view"></div>
      <div class="tickets view"></div>
      <div class="reviews view"></div>
    </div>
    <modal :show.sync="showModal" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up"></h4>
      <div class="legalInfo-container">
        <a
          href="Polityka prywatności platformy NOSPR Inspektor.pdf"
          target="blank"
          class="legalInfo"
          >Polityka prywatności</a
        >
      </div>
    </modal>
  </div>
</template>
<script>
import SignOut from "../components/SignOut";
import { Modal } from "@/components";

export default {
  components: {
    SignOut,
    Modal,
  },
  mounted() {
    let vm = this;
    document.querySelectorAll("[class*='view']").forEach((item) => {
      item.addEventListener("click", (event) => {
        if (
          typeof Notification !== "undefined" &&
          Notification?.permission !== "denied"
        ) {
          if (vm.$pusher.isClientReady()) {
            vm.$pusher.start();
          } else {
            vm.$pusher.init();
            vm.$pusher.setData(
              vm.$store.state.user.token,
              vm.$store.state.user.id,
            );
          }
        }
      });
    });
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    openModal() {
      this.$pusher.start();
      this.showModal = true;
    },
  },
};
</script>
<style scoped>
a {
  color: black !important;
}
</style>
