<template>
    <v-app>
      <v-container>
        <h1 class="display-1">Lista degli Utenti</h1>
        <v-btn color="primary" @click="fetchUsers">Carica Utenti</v-btn>
        <v-list v-if="users.length">
          <v-list-item v-for="user in users" :key="user.id">
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <p v-else>Nessun utente caricato.</p>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'App',
    data() {
      return {
        users: []
      };
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await fetch('https://back-pediline.onrender.com/api/v1/users');
          if (!response.ok) {
            throw new Error('Errore durante il recupero degli utenti');
          }
          const data = await response.json();
          this.users = data;
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style>
  /* Aggiungi stili personalizzati qui, se necessario */
  </style>
  