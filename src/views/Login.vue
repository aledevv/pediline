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

<script setup>
import { ref, onMounted } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js';
import router from '../router/router.js';

const HOST = 'http://localhost:3000';
const API_URL = `${HOST}/api/v1`;

const email = ref('alice@example.com');
const password = ref('password1');
const error = ref('');

const emit = defineEmits(['login']);

function login() {
  fetch(`${API_URL}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, password: password.value }),
    credentials: 'include' // Include cookies in the request
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.success) {
        setLoggedUser(data);
        emit('login', loggedUser);
        // Vai alla home dopo il login riuscito
        router.push('/');
      } else {
        error.value = 'Errore di autenticazione. Per favore, riprova.';
      }
    })
    .catch((err) => {
      console.error(err);
      error.value = 'Errore di autenticazione. Per favore, riprova.';
    });
}




function logout() {
  clearLoggedUser();
}
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

.submit-btn,
.home-btn {
  margin-top: 20px;
  width: 100%;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
