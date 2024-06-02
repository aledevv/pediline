<template>
    <v-container fluid class="register-container">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="register-card">
            <v-card-title class="headline">Registrazione</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="register">
                <v-text-field v-model="name" label="Nome" required></v-text-field>
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-select v-model="role" label="Ruolo" :items="roles" required></v-select>
                <v-text-field v-if="role === 'Genitore'" v-model="childName" label="Nome del Figlio"></v-text-field>
                <v-btn color="primary" type="submit" class="submit-btn">Registrati</v-btn>
                <v-btn to="/" class="home-btn">Torna alla Home</v-btn>
              </v-form>
              <p v-if="error" class="error-message">{{ error }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        role: '',
        name: '',
        childName: '',
        error: '',
        roles: ['Genitore', 'Accompagnatore']
      };
    },
    methods: {
      register() {
        // Simuliamo una richiesta di registrazione (sostituisci con la tua logica di registrazione)
        console.log('Email:', this.email);
        console.log('Password:', this.password);
        console.log('Ruolo:', this.role);
        console.log('Nome:', this.name);
        console.log('Nome del Figlio:', this.childName);
  
        // Effettua la validazione dei campi e gestisci la logica di registrazione
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .register-card {
    max-width: 400px;
    padding: 20px;
  }
  
  .submit-btn, .home-btn {
    margin-top: 20px;
    width: 100%;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  