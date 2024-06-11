<template>
  <v-app-bar color="secondary" elevation="1" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-container align="center">
        <v-img
          :width="300"
          height="40"
          contain
          src="../assets/logo.png"
        ></v-img>
      </v-container>
    <v-spacer></v-spacer>
    <template v-if="loggedUser.token">
     
      <EditProfile />
      <v-btn to="/logout" icon="mdi-logout" variant="text"></v-btn>
    </template>
  </v-app-bar>


  <!-- Navigation drawer -->
  <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'left' : 'left'">
    <v-sheet class="pa-4" color="secondary">
      <template v-if="loggedUser.token">
        <v-avatar class="mb-4"
          image="https://t3.ftcdn.net/jpg/05/71/08/24/360_F_571082432_Qq45LQGlZsuby0ZGbrd79aUTSQikgcgc.jpg"
          size="64"></v-avatar>
          <div v-text="loggedUser.email"></div>
      </template>
      <template v-else>
        <v-list-item prepend-icon="mdi-login" title="Login" to="/login" link></v-list-item>
        <v-list-item prepend-icon="mdi-account-plus" title="Sign up" to="/signup" link></v-list-item>
      </template>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>

      <v-list-item v-for="[icon, text, route] in links" :key="icon" :prepend-icon="icon" :title="text" :to="route"
        link></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, provide, inject } from 'vue'
import EditProfile from '@/components/EditProfileDialog.vue'
import { loggedUser } from '@/states/loggedUser.js'

const state = inject('state')
provide('state', state)


const drawer = ref(true)
const links = [
    ['mdi-home', 'Home', '/'],
    ['mdi-map', 'Linee', '/linee'],
    ['mdi-check-circle', 'Gestione presenze', '/presenze'],
    // account e logout sono fatti a parte
  ]

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

provide('toggleDrawer', toggleDrawer)
</script>

<style scoped>
/* Add your styles here */
</style>
