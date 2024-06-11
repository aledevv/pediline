<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Sessione terminata</h1>
        <v-btn to="/" color="primary">Torna alla Home</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const HOST = 'http://localhost:3000/api/v1';
const LINE_URL = `${HOST}/lines`;
const STOP_URL = `${HOST}/stops`;
const SCHOOL_URL = `${HOST}/schools`;
const TOKEN_URL = `${HOST}/token`;

export default {
  async mounted() {
    try {
      // Chiamata all'API per invalidare il token sul server
      await fetch('http://localhost:3000/api/v1/token/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Rimuovi il cookie contenente il token
      document.cookie = 'jwt=; Max-Age=0; path=/';

      // Reindirizza alla pagina di login
      window.location.href = '/login';
    } catch (error) {
      console.error('Errore durante il logout:', error.message);
    }
  }
}
</script>

<style>

</style>