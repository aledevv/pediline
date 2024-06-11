<template>
  <v-app id="inspire">
    <NavigationDrawer />
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-card color="grey-lighten-6" title="La tua linea">
              <MapLines height="40vh" :center="mapCenter" :schoolName="'Scuola ' + selectedSchool" :zoom="mapZoom" :color="mapColor" :stops="mapStops"/>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="loggedUser.role == 'genitore'">
            <v-card class="ma-auto" title="Prossime corse" height="40vh">
              <template v-slot:prepend>
                <v-avatar color="secondary">
                  <v-icon icon="mdi-calendar"></v-icon>
                </v-avatar>
              </template>
              <v-card-text>
                Puoi segnalare da qui eventuali assenze per questa settimana, oppure farlo dal calendario.
              </v-card-text>
              <v-row class="mx-auto">
                <v-col class="mx-auto px-auto" cols="auto" v-for="(week, index) in this_week" :key="week.date">
                  <v-btn v-if="week.presenza == 'presente'" color="primary" icon="mdi-check" size="small" variant="flat" @click="togglePresenza(index)" />
                  <v-btn v-if="week.presenza == 'assente'" color="red-lighten-2" icon="mdi-close" size="small" variant="flat" @click="togglePresenza(index)" />
                  <p v-if="week.presenza == 'assente'" class="text-caption" style="color: #E67878">Assente</p>
                  <p class="text-body-2 pl-1 pt-1" style="color: grey;">{{ week.date }}</p>
                </v-col>
              </v-row>
              <template v-slot:actions>
                <v-row class="ma-auto">
                  <v-col>
                    <v-btn to="/presenze" append-icon="mdi-chevron-right" color="primary" text="Gestisci presenze" variant="tonal" block></v-btn>
                  </v-col>
                </v-row>
              </template>
            </v-card>
          </v-col>
          <v-col v-if="loggedUser.role == 'accompagnatore'">
            <v-card class="ma-auto" title="Azioni accompagnatore" height="40vh">
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon icon="mdi-walk"></v-icon>
                </v-avatar>
              </template>
              <v-card-subtitle class="text-h7">Prossima corsa: Domani 8:30</v-card-subtitle>
              <template v-slot:actions>
                <v-col>
                  <v-row class="ma-auto">
                    <component v-if="service_status == 'stopped' || service_status == 'paused'" :is="playButton" @click="startService" />
                    <span class="pt-2 mt-2 text-h6" id="playButtonLabel">Inizia corsa</span>
                    <component v-if="service_status == 'running'" :is="pauseButton" @click="pauseService" />
                    <component v-if="service_status == 'running' || service_status == 'paused'" :is="stopButton" @click="stopService" />
                  </v-row>
                  <v-btn to="/lista-presenze" v-slot:append rounded="lg" class="mt-4" color="alternate" variant="outlined" block>Lista presenze</v-btn>
                </v-col>
              </template>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="mx-auto" max-width="100%" color="primary" height="40vh">
              <v-carousel :continuous="false" :show-arrows="false" delimiter-icon="mdi-square" height="100%" hide-delimiter-background cycle>
                <v-carousel-item v-for="alert in alerts" :key="alert.id">
                  <v-card class="mx-auto text-white" color="primary" prepend-icon="mdi-comment-text" variant="flat" :title="alert.title">
                    <template v-slot:prepend>
                      <v-icon size="x-medium"></v-icon>
                    </template>
                    <v-card-text class="text-h6 py-1">{{ alert.description }}</v-card-text>
                    <v-card-actions>
                      <v-list-item class="w-100">
                        <template v-slot:prepend>
                          <v-avatar :color="alert.author === 'Comune di Trento' ? 'grey-darken-3' : 'grey-darken-3'" :image="alert.author === 'Comune di Trento' ? imageLinks[0] : imageLinks[1]"></v-avatar>
                        </template>
                        <v-list-item-title>{{ alert.author }}</v-list-item-title>
                        <template v-slot:append>
                          <div class="justify-self-end">
                            <v-icon class="me-1" icon="mdi-calendar-text"></v-icon>
                            <span class="subheading me-2">{{ alert.date }}</span>
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
import { onMounted, ref, onBeforeMount } from 'vue'
import MapLines from '@/components/MapLines.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import pauseButton from '@/components/pauseButton.vue'
import stopButton from '@/components/stopButton.vue'
import { loggedUser } from '@/states/loggedUser.js'
import { fetchToken, fetchSchoolFromId, fetchLineFromId, fetchStopFromId } from './utils/apiFetch.js'

const alerts = ref([]); // Initialize as an empty array

let mapCenter = ref([11.122068743015461, 46.06733230951298]);
let mapZoom = ref(12);
let mapColor = ref('');
let mapStops = ref([]);
let schoolName = ref('');


const imageLinks = [
  'https://dwpt1kkww6vki.cloudfront.net/img/logo/province-trente.png',
  'https://www.elev8.ph/wp-content/uploads/2020/07/Staff-Icon1.png',
];

onBeforeMount(fetchToken);

onMounted(() => {
  fetchToken();
  fetchAlerts();

  console.log('Logged user:', loggedUser); // Debugging log
  
  if(loggedUser.token && loggedUser.line_id!=undefined && loggedUser.school_id!=undefined  && loggedUser.stop_id!=undefined ){
    setMapParameters();
  }
});

async function setMapParameters() {

  let userSchool = await fetchSchoolFromId(loggedUser.school_id);
  let userLine = await fetchLineFromId(loggedUser.line_id);
  let userStop = await fetchStopFromId(loggedUser.stop_id);

  console.log('User school:', userSchool); // Debugging log
  console.log('User line:', userLine); // Debugging log
  console.log('User stops:', userStop); // Debugging log

  schoolName.value = userSchool.name;
  mapCenter.value = [userSchool.position[1], userSchool.position[0]];
  mapZoom.value = 14;
  mapColor.value = userLine.color;
  mapStops.value.push({name: userStop.name, schedule: userStop.schedule, position: userStop.position});
}

async function fetchAlerts() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/alerts');
    const data = await response.json();
    
    console.log('Fetched data:', data); // Debugging log
    
    // Validate fetched data
    if (Array.isArray(data) && data.every(item => item.title && item.description && item.author && item.date)) {
      alerts.value = data;
    } else {
      console.error('Fetched data is not in the expected format:', data);
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
}

const windowWidth = ref(window.innerWidth);
const drawer = ref(true);

const service_status = ref('stopped');
const activeButton = ref('playButton');

const this_week = ref([
  {date: "27/05", presenza: "presente"},
  {date: "28/05", presenza: "assente"},
  {date: "29/05", presenza: "presente"},
  {date: "30/05", presenza: "presente"},
  {date: "31/05", presenza: "assente"}
]);

function startService() {
  service_status.value = 'running';
  activeButton.value = 'pauseButton';
  const label = document.getElementById('playButtonLabel');
  label.innerText = '';
  label.style.display = 'none';
  console.log('Servizio iniziato');
}

function pauseService() {
  service_status.value = 'paused';
  activeButton.value = 'playButton';
  const label = document.getElementById('playButtonLabel');
  label.innerText = 'Riprendi corsa';
  label.style.display = 'block';
  console.log('Servizio in pausa');
}

function stopService() {
  service_status.value = 'stopped';
  activeButton.value = 'playButton';
  const label = document.getElementById('playButtonLabel');
  label.innerText = 'Inizia corsa';
  label.style.display = 'block';
  console.log('Servizio terminato');
}

function togglePresenza(index) {
  if (this_week.value[index].presenza === 'presente') {
    this_week.value[index].presenza = 'assente';
  } else {
    this_week.value[index].presenza = 'presente';
  }
}
</script>
