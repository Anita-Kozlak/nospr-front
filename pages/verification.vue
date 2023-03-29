<template>
  <div class="page-header page-opacity">
    <div id="div_background">
      <div style="background-image: url('img/background_image.jpg')"></div>
    </div>
    <div class="section section-regulations">
      <div class="container container-height verification">
        <img v-lazy="'img/nospr_logo.jpg'" alt="" />

        <h2 class="text-light pt-5">Oczekiwanie na weryfikację</h2>
        <NuxtLink to="/user/login" class="navbar btn-mainview" style="display: flow-root"
          >Kliknij aby wrócić do strony logowania
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
