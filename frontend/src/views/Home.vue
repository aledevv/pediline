<template>
  <v-app id="inspire">

   <NavigationDrawer />


  <!-- MAIN BODY -->
    <v-main>
      <v-container
        class=""
        fluid
      >

      <!-- MAP -->
        <v-row>
          <v-col>
              <v-card
                  color="grey-lighten-6"
                  max-height="50vh"
                  title="La tua linea"
              >
              <MapLines />

              </v-card>
          </v-col>
        </v-row>

      <!-- FERMATA -->
        <v-row>
          <v-col v-if="role==='user'">
              <v-card
                  class="ma-auto"
                  title="Prossime corse"
                  height="40vh"
              >
                  <template v-slot:prepend>
                      <v-avatar color="secondary">
                          <v-icon icon="mdi-calendar"></v-icon>
                      </v-avatar>
                  </template>
                  <v-card-text>Puoi segnalare da qui eventuali assenze per questa settimana, oppure farlo dal calendario. </v-card-text>
                  <v-row class="mx-auto">

                    <v-col
                    class="mx-auto px-auto" 
                    cols="auto"
                    v-for="(week, index) in this_week"
                    :key="week.date"
                    >
                      <v-btn v-if="week.presenza == 'presente'" color="primary" icon="mdi-check" size="small" variant="flat" @click="togglePresenza(index)"/>
                      <v-btn v-if="week.presenza == 'assente'" color="red-lighten-2" icon="mdi-close" size="small" variant="flat" @click="togglePresenza(index)"/>
                      <p v-if="week.presenza == 'assente'" class="text-caption" style="color: #E67878">Assente</p>
                      <p class="text-body-2 pl-1 pt-1" style="color: grey;">{{ week.date }}</p>
                    </v-col>
                  </v-row>
                  
                  
                  
                  <template v-slot:actions>
                      <v-row class="ma-auto">
                          <!-- <v-col>
                              <v-btn
                                  to='/assenza'
                                  append-icon="mdi-chevron-right"
                                  color="red-lighten-2"
                                  text="Segnala assenza"
                                  variant="outlined"
                                  block
                              ></v-btn>
                          </v-col> -->
                          <v-col>
                              <v-btn
                                  to='/presenze' 
                                  append-icon="mdi-chevron-right"
                                  color="primary"
                                  text="Gestisci presenze"
                                  variant="tonal"
                                  block
                              ></v-btn>
                          </v-col>
                      </v-row>
                  </template>
              </v-card>
          </v-col>


          <!-- ACCOMPAGNATORE START SERVICE -->
          <v-col v-if="role==='accompagnatore'">
              <v-card
                  class="ma-auto"
                  title="Azioni accompagnatore"
                  height="40vh"
              >
                  <template v-slot:prepend>
                      <v-avatar color="primary">
                          <v-icon icon="mdi-walk"></v-icon>
                      </v-avatar>
                  </template>
                  <v-card-subtitle class="text-h7"> Prossima corsa: Domani 8:30 </v-card-subtitle>

                  <template v-slot:actions>
                    <v-col>
                      <v-row class="ma-auto">

                        <!-- PLAY/PAUSE BUTTONS -->
                        <component v-if="service_status =='stopped' || service_status == 'paused'" :is="playButton" @click="startService"/> <span class="pt-2 mt-2 text-h6" id="playButtonLabel">Inizia corsa</span>
                        <component v-if="service_status == 'running'" :is="pauseButton" @click="pauseService"/>
                      
                        <!-- STOP BUTTON -->
                        <component v-if="service_status == 'running' || service_status == 'paused'" :is="stopButton" @click="stopService"/>
                      </v-row>
                      <v-btn to="/lista-presenze" v-slot: append rounded="lg" class="mt-4" color="alternate" variant="outlined" block>Lista presenze</v-btn>
                    </v-col>
                  </template>

                  
               
              </v-card>
              
          </v-col>


          <!-- SEZIONE AVVISI -->
          <v-col>
              <v-card
                  class="mx-auto"
                  max-width="100%"
                  color="primary"
                  height="40vh"
              >
                  <v-carousel
                  :continuous="false"
                  :show-arrows="false"
                  delimiter-icon="mdi-square"
                  height="100%"
                  hide-delimiter-background
                  cycle
                  >
                  <v-carousel-item
                      v-for="[title, description, author, img_link, date] in alerts"
                      :key="title"
                  >


                      <!-- Card Avviso colorata -->
                      <v-card
                          class="mx-auto text-white"
                          color="primary"
                          prepend-icon="mdi-comment-text"
                          variant="flat"
                          :title=title
                      >
                          <template v-slot:prepend>
                              <v-icon size="x-medium"></v-icon>
                          </template>

                          <v-card-text class="text-h6 py-1">
                          "{{ description }}"
                          </v-card-text>

                          <v-card-actions>
                          <v-list-item class="w-100">
                              <template v-slot:prepend>
                                <v-avatar
                                    color="grey-darken-3"
                                    :image=img_link
                                ></v-avatar>
                              </template>

                              <v-list-item-title>{{author}}</v-list-item-title>

                              <template v-slot:append>
                              <div class="justify-self-end">
                                  <v-icon class="me-1" icon="mdi-calendar-text"></v-icon>
                                  <span class="subheading me-2">{{date}}</span>
                              </div>
                              </template>
                          </v-list-item>
                          </v-card-actions>
                      </v-card>
                  </v-carousel-item>
                  </v-carousel>
              </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
//import MapLines from '@/components/MapLines.vue'
import playButton from '@/components/playButton.vue'
import pauseButton from '@/components/pauseButton.vue'
import stopButton from '@/components/stopButton.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

const windowWidth = ref(window.innerWidth)
const drawer = ref(true)
const role = 'user' // "user" o "accompagnatore" // ------------------- CAMBIA QUI -------------------

const service_status = ref('stopped')
const activeButton = ref('playButton')

// DATA -----------------------------------------------------

const alerts = [
  ['Avviso 1', 'Scuole chiuse domani', "Comune di Trento", "https://dwpt1kkww6vki.cloudfront.net/img/logo/province-trente.png", "15 Apr 2024"],
  ['Avviso 2', 'Parte il pedibus di Martignano', "Staff pedibus", "https://www.elev8.ph/wp-content/uploads/2020/07/Staff-Icon1.png", "17 Apr 2024"],
  ['Avviso 3', 'Il resoconto delle statistiche dei pedibus', "Comune di Trento", "https://dwpt1kkww6vki.cloudfront.net/img/logo/province-trente.png", "21 Mag 2024"],
  ['Avviso 4', 'Evento comune di Trento', "Staff pedibus", "https://www.elev8.ph/wp-content/uploads/2020/07/Staff-Icon1.png", "26 Mag 2024"],
]

const this_week = ref([
  {date: "27/05", presenza: "presente"},
  {date: "28/05", presenza: "assente"},
  {date: "29/05", presenza: "presente"},
  {date: "30/05", presenza: "presente"},
  {date: "31/05", presenza: "assente"}
])

// FUNCTIONS -----------------------------------------------------
function startService() {
  service_status.value = 'running'
  activeButton.value = 'pauseButton'
  let label = document.getElementById('playButtonLabel')
  label.innerText = ''
  label.style.display = 'none'
  console.log('Servizio iniziato')
}

function pauseService() {
  service_status.value = 'paused'
  activeButton.value = 'playButton'
  let label = document.getElementById('playButtonLabel')
  label.innerText = 'Riprendi corsa'
  label.style.display = 'block'
  console.log('Servizio in pausa')
}

function stopService() {
  service_status.value = 'stopped'
  activeButton.value = 'playButton'
  let label = document.getElementById('playButtonLabel')
  label.innerText = 'Inizia corsa'
  label.style.display = 'block'
  console.log('Servizio terminato')
}

function togglePresenza(index) {
  if (this_week.value[index].presenza == 'presente') {
    this_week.value[index].presenza = 'assente'
  } else {
    this_week.value[index].presenza = 'presente'
  }
}
</script>
