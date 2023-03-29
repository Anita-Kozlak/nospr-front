<template>
  <div>
    <nuxt />
  </div>
</template>
<script>


  import MainNavbar from "@/components/layout/MainNavbar.vue";
  import MainFooter from "@/components/layout/MainFooter.vue";
  export default {
    middleware: ['auth', 'version'],
    components: {
      MainFooter,
      MainNavbar
    }
  }
</script>
<style>
</style>

