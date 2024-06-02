<template>
    <v-container fluid class="login-container">
      <v-row justify="center" align="center" class="full-height">
        <v-col cols="12" sm="8" md="4">
          <v-card class="login-card">
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" type="submit" class="submit-btn">Login</v-btn>
              </v-form>
              <p v-if="error" class="error-message">{{ error }}</p>
              <v-btn to="/" class="home-btn">Torna alla Home</v-btn>
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
        error: ''
      };
    },
    methods: {
      login() {
        // Simuliamo una richiesta di login (sostituisci con la tua logica di autenticazione)
        if (this.email === 'test@example.com' && this.password === 'password') {
          // Login riuscito, esegui il reindirizzamento ad una pagina di successo o fai altre operazioni necessarie
          // Esempio: this.$router.push('/dashboard');
          console.log('Login riuscito!');
        } else {
          // Login fallito, mostra un messaggio di errore
          this.error = 'Credenziali non valide. Per favore, riprova.';
        }
      },
      goToHome() {
        // Esegui il reindirizzamento alla home
        // Esempio: this.$router.push('/');
        console.log('Tornando alla Home');
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
  }
  
  .full-height {
    height: 100%;
  }
  
  .login-card {
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
  