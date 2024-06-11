<template>
  <v-app id="inspire">
    <!-- Navigation Drawer -->
    <NavigationDrawer/>

    <!-- ---------------------- BODY---------------------- -->
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <h1 class="pb-2">Mappa delle linee</h1>
        
        <v-row>
          <v-col cols="4">
            <v-select
              label="Scuola"
              :items="schools_name"
              placeholder="Seleziona linea"
              persistent-placeholder="true"
              v-model="selectedSchool"
              @change="updateLines"
            ></v-select>

            <v-progress-circular
              v-if="loading == true"
              indeterminate
              color="primary"
              :size="70"
              :width="7"
            ></v-progress-circular>

            <v-card class="mt-3" v-for="line in lines" :key="line" v-if="lines.length > 0">
              <v-card-title>{{ line.name }}</v-card-title>

              <v-card-text>
                <v-timeline align="start" density="compact">
                  <v-timeline-item
                    v-for="stop in line.stops"
                    :key="stop.schedule"
                    :dot-color="line.color"
                    :icon="stop == line.stops[line.stops.length - 1] ? 'mdi-school' : 'mdi-map-marker'"
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
              <MapLines :center="mapCenter" :zoom="mapZoom" :schoolName="'Scuola ' + selectedSchool" :color="mapColor" :stops="mapStops"/>              <!-- Map component -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import NavigationDrawer from '@/components/NavigationDrawer.vue';
import MapLines from '@/components/MapLines.vue';
import { fetchSchoolsFull, fetchStopsByLines } from './utils/apiFetch.js';

let schools = {};
const schools_name = ref([]); // Array of schools name
const selectedSchool = ref(''); // School to show
const lines = ref([]); // Array of lines
let mapCenter = ref([11.122068743015461, 46.06733230951298]);
let mapZoom = ref(12);
let mapColor = ref('');
let mapStops = ref([]);

const loading = ref(false);

const localFetchSchools = async () => {
    loading.value = true;
    schools = await fetchSchoolsFull()

    setArrayOfSchoolsName(); // create list of names of schools to show in combobox

    selectedSchool.value = schools_name.value[0]; // Set the default selected school
    mapCenter.value = [schools[selectedSchool.value].position[1], schools[selectedSchool.value].position[0]]; // Set the default center of the map
    mapZoom.value = 14.5; // Set the default zoom of the map
    if (schools[selectedSchool.value].lines.length > 0){
      mapColor.value = schools[selectedSchool.value].lines[0].color; // Set the default color of the line
    }else{
      mapColor.value = 'black'; // Set the default color of the line
    }

    

    await updateLines(); // Update lines after setting the default school
    loading.value = false;
};

function setArrayOfSchoolsName() {
  for (let school in schools) {
    schools_name.value.push(school);
  }
}

const updateLines = async () => {
  const school = schools[selectedSchool.value];
  mapCenter.value = [school.position[1], school.position[0]];


  if (school.lines.length > 0){
    mapColor.value = school.lines[0].color;
  }else{
    mapColor.value = '#000000';     // se non ci sono linee nella scuola, il colore di default è nero
  }

  if (school) {
    lines.value = school.lines;
  } else {
    lines.value = [];
  }

  // Inserisco fermate nel array da passare alla mappa
  mapStops.value = [];
  for (let line in lines.value){
    console.log("stops of", lines.value[line].name, lines.value[line].stops);
    for(let stop in lines.value[line].stops){
      mapStops.value.push({name: lines.value[line].stops[stop].name, schedule: lines.value[line].stops[stop].schedule, position: lines.value[line].stops[stop].position});
    }
  }
  
};

watch(selectedSchool, updateLines);

onMounted(() => {
  localFetchSchools();
});

</script>

<style>
/* Il tuo stile qui */
</style>
