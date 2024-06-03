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
            <v-combobox
              label="Scuola"
              :items="schools_name"
              placeholder="Seleziona linea"
              persistent-placeholder="true"
              v-model="selectedSchool"
              @change="updateLines"
            ></v-combobox>

            <v-card class="mt-3" max-width="400" v-for="line in lines" :key="line">
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
const SCHOOL_URL = `${HOST}/schools`;

//const schools = ['Povo', 'Mesiano', 'Centro', 'Villazzano', 'Sardagna', 'Gardolo', 'Cognola', 'Vaneze', 'Vela', 'Ravina']

const schools = {};
const schools_name = ref([]); // Array of schools name
const selectedSchool = ref(''); // School to show


// alert(schools[selectedSchool.value].lines[0].stops[0].name)

const fetchSchools = async () => {
  try {
    const response = await fetch(SCHOOL_URL);
    const data = await response.json();
    
    for (let school of data) {    // create object with schools each one is a line
      const schoolLines = await fetchStopsByLines(school.linesId);
      schools[school.name] = {
        id: school.id,
        name: school.name,
        lines: schoolLines
      };
    }

    setArrayOfSchoolsName();   // create list of names of schools to show in combobox
    
    selectedSchool.value = schools_name.value[0]  // Set the default selected school

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

async function fetchStopsByLines(lineList) {
  const lines = [];
  try {
    for (let lineId of lineList) {
      const response = await fetch(`${LINE_URL}/${lineId}`);
      const lineData = await response.json();

      const stopsResponse = await fetch(`${STOP_URL}/?line=${lineId}`);
      const stopsData = await stopsResponse.json();
      lines.push({
        id: lineData.id,
        name: lineData.name,
        stops: stopsData
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return lines;
};

function setArrayOfSchoolsName() {
  for (let school in schools) {
    schools_name.value.push(school);
  }
}

const updateLines = () => {
  const school = schools[selectedSchool.value];
  if (school) {
    lines.value = school.lines;
  } else {
    lines.value = [];
  }
};

// Chiama la funzione fetchStops quando il componente viene montato
onMounted(() => {
  fetchSchools();
});

</script>

<style>
/* Il tuo stile qui */
</style>
