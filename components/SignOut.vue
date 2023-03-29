<template>
    <div class="buttons">
        <button @click="logout" class="navbar btn-signout">Wyloguj</button>
    </div>
</template>

<script>
export default {
    name: 'signout',
    methods: {
     logout() {
        this.$store.dispatch('user/logout')

      }
    }
}
</script>