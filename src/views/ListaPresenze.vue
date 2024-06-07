<template>
    <v-app id="inspire">
  


    <!-- Navigation Drawer -->
    <NavigationDrawer />
  

    <!-- MAIN BODY -->
      <v-main>
        <v-container class="mx-auto" >
          <h1>Lista presenze</h1>
          
          <v-col
          align="center">
          
          <div style="background-color: #017171; border-radius: 20px;">
            <h3 style="color: white;">Presenti</h3>
          </div>

            <v-list
              align="center"
              max-width="80%"
              v-for="(persona, index) in presenti"
              :key="persona.nome"
            >
    
              <v-list-item
                prepend-icon="mdi-face"
                :title="persona.nome"
              >
              <template v-slot:append>
                <v-btn
                  color="red-lighten-2"
                  prepend-icon="mdi-close"
                  variant="text"
                  @click="rendiAssente(index)"
                >Assente</v-btn>
              </template>

              </v-list-item>
    
              <v-divider inset></v-divider>
    
            </v-list>

            <div style="background-color: #90A4AE; border-radius: 20px;">
              <h3 style="color: white;">Assenti</h3>
            </div>

            <v-list
              align="center"
              max-width="80%"
              v-for="(persona, index) in assenti"
              :key="persona.nome"
            >
    
              <v-list-item
                prepend-icon="mdi-face"
                :title="persona.nome"
              >
              <template v-slot:append>
                <v-btn
                  color="success"
                  prepend-icon="mdi-check"
                  variant="text"
                  @click="rendiPresente(index)"
                >Presente</v-btn>
              </template>

              </v-list-item>
    
              <v-divider inset></v-divider>
    
            </v-list>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
<script setup >
  import { ref } from 'vue'
  import NavigationDrawer from '@/components/NavigationDrawer.vue';

  const drawer = ref(true)

  const links = [
    ['mdi-home', 'Home', '/'],
    ['mdi-map', 'Linee', '/linee'],
    ['mdi-calendar', 'Calendario', '/calendario-linea-api'],
    ['mdi-account', 'Profilo', '/account'],
    ['mdi-logout', 'Logout', '/logout'],
  ]


  const presenti = ref([
    {nome: "Mario Rossi", presenza: "presente"},
    {nome: "Luca Bianchi", presenza: "assente"},
    {nome: "Giovanni Verdi", presenza: "presente"},
    {nome: "Paolo Neri", presenza: "assente"},
    {nome: "Giuseppe Gialli", presenza: "presente"},
    {nome: "Antonio Arancioni", presenza: "assente"},
    {nome: "Francesco Viola", presenza: "presente"},
  ]);


  const assenti = ref([
    {nome: "Carlo Blu", presenza: "assente"},
    {nome: "Giacomo Rosa", presenza: "presente"},
    {nome: "Daniele Marrone", presenza: "assente"},
    {nome: "Vincenzo Azzurro", presenza: "presente"},
    {nome: "Roberto Celeste", presenza: "assente"},
    {nome: "Alberto Turchese", presenza: "presente"},
    {nome: "Alessandro Indaco", presenza: "assente"},
  ]);

  const sortAll = () => {
    presenti.value.sort((a, b) => a.nome.localeCompare(b.nome));
    assenti.value.sort((a, b) => a.nome.localeCompare(b.nome));
  };

  sortAll();

  const rendiAssente = (index) => {
    assenti.value.push(presenti.value[index]);
    presenti.value.splice(index, 1);
    sortAll();
  };

  const rendiPresente = (index) => {
    presenti.value.push(assenti.value[index]);
    assenti.value.splice(index, 1);
    sortAll();
  };

</script>