<template>
  <v-app id="inspire">
    <!-- Navigation Drawer -->
    <NavigationDrawer />

    <!-- ---------------------- BODY---------------------- -->
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <h1 class="pb-2">Mappa delle linee</h1>

        <v-row>
          <v-col cols="4">
            <v-combobox
              label="Scuola"
              :items="schools"
              placeholder="Seleziona linea"
              persistent-placeholder="true"
            ></v-combobox>

            <v-card class="mt-3" max-width="400" v-for="line in lines" :key="line.self">
              <v-card-title>{{ line.name }}</v-card-title>

              <v-card-text>
                <v-timeline align="start" density="compact">
                  <v-timeline-item
                    v-for="stop in line.stops"
                    :key="stop.schedule"
                    :dot-color="stop.color"
                    :icon="stop.icon"
                  >
                    <div class="mb-4">
                      <div>
                        <strong>{{ stop.name }}</strong>
                      </div>
                      <div class="font-weight-light">Arrivo: {{ stop.schedule }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col>
            <v-sheet rounded="lg" max-width="100%">
              <!-- <MapLines />               Map component -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavigationDrawer from '@/components/NavigationDrawer.vue';

const HOST = 'http://localhost:3000/api/v1';
const LINE_URL = `${HOST}/lines`;
const STOP_URL = `${HOST}/stops`;


const schools = ['Povo', 'Mesiano', 'Centro', 'Villazzano', 'Sardagna', 'Gardolo', 'Cognola', 'Vaneze', 'Vela', 'Ravina'];
const stops = ref([]);
const lines = ref([]);


const fetchLines = async () => {
  try {
    const response = await fetch(LINE_URL);
    const data = await response.json();
    lines.value = data;
    console.log('Lines fetched:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Funzione per fare il fetch dei dati dall'API
const fetchStops = async () => {
  try {
    const response = await fetch(STOP_URL);
    const data = await response.json();
    stops.value = data;
    console.log('Stops fetched:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Chiama la funzione fetchStops quando il componente viene montato
onMounted(() => {
  fetchLines();
  fetchStops();
});
</script>

<style>
/* Il tuo stile qui */
</style>
