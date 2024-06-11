<template>
  <v-container fluid class="register-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="register-card">
          <v-card-title class="headline">Registrazione</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <!-- <v-text-field v-model="name" label="Nome" required></v-text-field> -->
              <v-text-field v-model="email" label="Email" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-select v-model="role" label="Ruolo" :items="roles" required></v-select>
              <!-- <v-text-field v-if="role === 'Genitore'" v-model="childName" label="Nome del Figlio"></v-text-field> -->
              <v-btn color="primary" @click="checkAndRegister" class="submit-btn">Registrati</v-btn>
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
const HOST = 'http://localhost:3000/api/v1';
const LINE_URL = `${HOST}/lines`;
const USER_URL = `${HOST}/users`;
const STOP_URL = `${HOST}/stops`;
const SCHOOL_URL = `${HOST}/schools`;
const TOKEN_URL = `${HOST}/token`;
export default {
  data() {
    return {
      email: 'ali@mai.com',
      password: '123',
      role: 'Genitore',
      // name: '',
      // childName: '',
      error: '',
      roles: ['Genitore', 'Accompagnatore']
    };
  },
  methods: {
    async checkAndRegister() {
    // Controlla se l'email esiste già prima di procedere con la registrazione
    try {
        const emailExists = await this.checkEmailExists(this.email);
        console.log('Email exists:', emailExists);
        if (emailExists) {
            this.error = 'Questa email è già stata utilizzata. Si prega di utilizzare un\'altra email.';
        } else {
            // Esegui la registrazione solo se l'email non esiste già
            const registrationSuccess = await this.register();
            console.log('Registration success:', registrationSuccess);
            if (registrationSuccess) {
                // Redirect o altre azioni dopo la registrazione avvenuta con successo
            } else {
                // Gestione dell'errore durante la registrazione
            }
        }
    } catch (error) {
        console.error('Errore durante la verifica dell\'email o registrazione:', error);
        // Gestione dell'errore
    }
},
    async checkEmailExists(email) {
      try {
        const response = await fetch(USER_URL + `/exist?email=${email}`);
        const data = await response.json();
        return data.exists;
      } catch (error) {
        console.error('Errore durante il controllo dell\'email:', error);
        return false;
      }
    },
    async register() {
  try {
    const response = await fetch(USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password,
        role: this.role
      })
    });

    if (!response.ok) {
      throw new Error('Errore durante la richiesta di registrazione');
    }

    const data = await response.json();
    console.log('Risposta dalla registrazione:', data); // Aggiunto per il debug
    // Registrazione avvenuta con successo
    // ritorna alla home
    this.$router.push('/');
    alert('Registrazione avvenuta con successo!')
    return true;
  } catch (error) {
    console.error('Errore durante la registrazione:', error.message || 'Errore sconosciuto');
    this.error = error.message || 'Errore sconosciuto'; // Imposta il messaggio di errore
    return false;
  }
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
