<template>
  <div
    class="section-image-background"
    style="background-image: url('img/background_image.jpg')"
  >
    <div class="buttons section-contacts">
      <NuxtLink to="/" class="navbar btn-mainview"> Strona główna </NuxtLink>
      <sign-out></sign-out>
    </div>
    <div class="section section-contacts">
      <div class="container container-height">
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto">
            <h3 class="title contacts-title">
              Dyrektor Artystyczny- Giancarlo Guerrero
            </h3>
            <p class="contact-phone">tel. kom. : +1 615 419 0359</p>
            <p class="contact-email">e-mail: giancarloguerrero1@gmail.com</p>
          </div>
          <div class="col-md-8 ml-auto mr-auto">
            <h3 class="title contacts-title">
              Inspektor Orkiestry Symfonicznej- Jacek Sosna
            </h3>
            <p class="contact-phone">tel. kom. : 728447004</p>
            <p class="contact-email">e-mail: jacek.sosna@nfm.wroclaw.pl</p>
          </div>
          <div class="col-md-8 ml-auto mr-auto">
            <h3 class="title contacts-title">
              Manager Orkiestry Symfonicznej- Natalia Klingbajl
            </h3>
            <p class="contact-phone">tel. kom. : 517818321</p>
            <p class="contact-email">
              e-mail: Natalia.Klingbajl@nfm.wroclaw.pl
            </p>
          </div>
          <div class="col-md-8 ml-auto mr-auto">
            <h3 class="title contacts-title">Konserwator- Krzysztof Frąk</h3>
            <p class="contact-phone">tel. kom. : 661 497 982</p>
            <p class="contact-email">e-mail: kszysztof.frak@nfm.wroclaw.pl</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Card, Button, Comment, Checkbox } from "@/components";
import SignOut from "../components/SignOut";

export default {
  name: "contacts",
  components: {
    Card,
    Comment,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    SignOut,
  },
};
</script>
<style></style>