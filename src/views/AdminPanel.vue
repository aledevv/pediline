<template>
  <v-app id="inspire">
    <NavigationDrawer />

    <!-- MAIN BODY -->
    <v-main>
      <v-container fluid>
        <h1 class="pb-2">Pannello admin</h1>
        <v-card class="ma-auto">
          <template v-slot:title>
            <div class="d-flex justify-space-between align-center">
              <div>Scuole</div>
              <v-btn
                class="me-2 text-none"
                color="primary"
                prepend-icon="mdi-plus"
                @click="openCreationDialogSchool"
              >
              Aggiungi scuola
              </v-btn>
            </div>
          </template>
          <v-card-text>
            <v-row>
              <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"
                :size="70"
                :width="7"
              ></v-progress-circular>
              <!-- Itera sulla lista delle scuole -->
              <v-col v-for="school in schools" :key="school.id" cols="4" sm="4" md="4" lg="4">
                <v-expand-transition>
                  <v-card>
                    <v-card-title @click="toggleExpansion(school.id)">
                      {{ school.name }}
                    </v-card-title>
                    
                    <v-card-actions class="d-flex align-center justify-space-between mr-3">
                      <div>
                        <v-tooltip location="bottom" text="Modifica scuola">
                          <template v-slot:activator="{ props }">
                            <v-btn icon class="edit-icon" v-bind="props" @click.stop="editSchool(index)">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>

                        <v-tooltip location="bottom" text="Elimina scuola">
                          <template v-slot:activator="{ props }">
                            <v-btn icon class="delete-icon" v-bind="props" @click.stop="deleteSchoolUI(school.id)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>

                        <v-tooltip location="bottom" text="Aggiungi linea">
                          <template v-slot:activator="{ props }">
                            <v-btn icon v-bind="props" class="add-icon" @click.stop="openCreationDialogLine(school.id)">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>
                      </div>
                      <v-btn icon @click="toggleExpansion(school.id)">
                        <v-icon :class="{'rotate-180': expandedSchool === school.id}" style="font-size: 28px;">mdi-chevron-down</v-icon>
                      </v-btn>
                    </v-card-actions>
                    
                    <v-expand-transition>
                      <v-card-text v-if="expandedSchool === school.id">
                        <v-row>
                          <v-col cols="12">
                            <v-list>
                              <v-list-subheader>Linee</v-list-subheader>

                              <v-list-item
                                v-for="line in school.lines"
                                :key="line.id"
                                :title="line.name"
                              >
                                <template v-slot:prepend>
                                  <v-avatar :color="line.color">
                                    <v-icon color="white">mdi-vector-polyline</v-icon>
                                  </v-avatar>
                                </template>

                                <template v-slot:append>
                                
                                  <v-tooltip location="bottom" text="Modifica linea">
                                    <template v-slot:activator="{ props }">
                                      <v-btn icon size="small" v-bind="props" class="edit-icon" variant="flat">
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                  
                                  <v-tooltip location="bottom" text="Elimina linea">
                                    <template v-slot:activator="{ props }">
                                      <v-btn icon size="small" v-bind="props" class="delete-icon" variant="flat" @click="deleteLineUI(line.id)">
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                  
                                  <v-tooltip location="bottom" text="Fermate">
                                    <template v-slot:activator="{ props }">
                                      <v-btn icon size="small" class="stops-icon" v-bind="props" variant="flat" @click="openDialogFermate(line)">
                                        <v-icon>mdi-map-marker-multiple</v-icon>
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                </template>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-expand-transition>
                  </v-card>
                </v-expand-transition>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>
        <v-row>
          <v-col>
            <v-card title="Mappa delle Linee">
              <v-sheet rounded="lg" max-width="100%">
                <MapLines/> <!-- Map component -->
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Dialog per la creazione di una nuova scuola -->
      <v-dialog v-model="dialogSchool" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline mt-2">Aggiungi scuola</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formSchool" v-model="validSchool">
              <v-text-field 
                v-model="newSchool.name" 
                label="Nome scuola" 
                :rules="[v => !!v || 'Nome scuola è obbligatorio']" 
                required>
              </v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newSchool.lat" 
                    label="Latitudine" 
                    :rules="[v => !!v || 'Latitudine è obbligatoria']" 
                    required>
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newSchool.lng" 
                    label="Longitudine" 
                    :rules="[v => !!v || 'Longitudine è obbligatoria']" 
                    required>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="mr-3 mb-3">
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialogSchool">Annulla</v-btn>
            <v-btn color="primary" variant="flat" @click="saveSchool">Salva</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog per la creazione di una nuova linea -->
      <v-dialog v-model="dialogLine" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline mt-2">Aggiungi linea</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formLine" v-model="validLine">
              <v-text-field 
                v-model="newLine.name" 
                label="Nome linea" 
                :rules="[v => !!v || 'Il nome della linea è obbligatorio']" 
                required>
              </v-text-field>
              <v-text-field
                v-model="newLine.color"
                label="Colore linea"
                readonly
                prepend-icon="mdi-palette"
              >
              </v-text-field>
              <v-row justify="center">
                <v-color-picker v-model="newLine.color" mode="hex" canvas-height="120"></v-color-picker>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="mr-3 mb-3">
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialogLine">Annulla</v-btn>
            <v-btn color="primary" variant="flat" @click="saveLine">Salva</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog con le fermate -->
      <v-dialog v-model="dialogFermate" max-width="800px">
        <v-card>
          <v-card-title>Fermate</v-card-title>
          <v-card-subtitle>Linea: {{ selectedLine.name }}</v-card-subtitle>
          <v-card-text>
            <!-- Qui inserisci la tua timeline con le fermate e gli orari di arrivo -->
            <!-- Esempio di una timeline statica -->
            <v-timeline dense>
              <v-timeline-item
                v-for="(stop, index) in selectedLine.stops"
                :key="index"
                :dot-color="selectedLine.color"
                :icon="index === selectedLine.stops.length - 1 ? 'mdi-school' : 'mdi-map-marker'"
              >
                <v-avatar>
                  <v-icon>mdi-map-marker</v-icon>
                </v-avatar>
                <v-card>
                  <v-card-title>{{ stop.name }}</v-card-title>
                  <v-card-subtitle>Orario di arrivo: {{ stop.schedule }}</v-card-subtitle>
                  <v-tooltip location="bottom" text="Modifica fermata">
                    <template v-slot:activator="{ props }">
                      <v-btn icon size="small" v-bind="props" class="edit-icon ml-2" variant="flat">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip location="bottom" text="Elimina fermata">
                    <template v-slot:activator="{ props }">
                      <v-btn icon size="small" v-bind="props" class="delete-icon" variant="flat" @click="deleteStopUI(stop)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="elevated" @click="openCreationDialogFermata">Aggiungi fermata</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeDialogFermate">Chiudi</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog per la creazione di una nuova fermata -->
      <v-dialog v-model="dialogCreaFermata" max-width="500px">
        <v-card>
          <v-card-title>
            Creazione fermata
          </v-card-title>
          <v-card-text>
            <v-form ref="formStop" v-model="validStop">
              <v-text-field 
                v-model="newStop.name" 
                label="Nome fermata" 
                :rules="[v => !!v || 'Il nome della fermata è obbligatorio']" 
                required
              >
              </v-text-field>
              <v-text-field
                v-model="newStop.schedule"
                label="Orario di arrivo"
                placeholder="HH:mm"
                :rules="[v => !!v || 'L\'orario di arrivo è obbligatorio – formato: HH:mm']"
                required
                v-mask="'##:##'"
                clearable
              >
                <template v-slot:append>
                  <v-icon color="primary">mdi-clock-time-four-outline</v-icon>
                </template>
              </v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newStop.lat" 
                    label="Latitudine" 
                    :rules="[v => !!v || 'Latitudine è obbligatoria']" 
                    required>
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newStop.lng" 
                    label="Longitudine" 
                    :rules="[v => !!v || 'Longitudine è obbligatoria']" 
                    required>
                  </v-text-field>
                </v-col>
              </v-row>
              <!-- Aggiungi altri campi, se necessario -->
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeCreationDialogFermata">Annulla</v-btn>
            <v-btn color="primary" @click="saveStop">Salva</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, onBeforeMount, ref, watch } from 'vue'
import MapLines from '@/components/MapLines.vue'
import { useRouter } from 'vue-router';
import { loggedUser } from "../states/loggedUser.js"
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import { fetchToken, fetchSchoolsFull, createSchool, deleteSchool, createLine, updateSchool, fetchSchoolFromId, deleteLine, fetchLineFromId, updateLine, createStop, deleteStop} from './utils/apiFetch';


// Definisci la lista delle scuole
const schools = ref([]);
// Dialog per la creazione di una nuova scuola
const dialogSchool = ref(false);
// Nuova scuola
const newSchool = ref({
  name: '',
  lat: '',
  lng: '',
});
const validSchool = ref(false);
const formSchool = ref(null);     // riferimento a form school
const expandedSchool = ref(null);
const loading = ref(false);


const dialogLine = ref(false);
const newLine = ref({
  name: '',
  color: '',
});
const validLine = ref(false);
const formLine = ref(null);     // riferimento a form line
const selectedSchoolForCreation = ref(null);


const dialogFermate = ref(false);
const stops= [ // Esempio di dati delle fermate con orari di arrivo
        { name: 'Fermata 1', arrivalTime: '08:00' },
        { name: 'Fermata 2', arrivalTime: '08:30' },
        { name: 'Fermata 3', arrivalTime: '09:00' }
      ]

const selectedLine = ref(null);

const dialogCreaFermata = ref(false);
const newStop = ref({
  name: '',
  schedule: '',
  lat: '',
  lng: '',
});
const validStop = ref(false);
const formStop = ref(null);     // riferimento a form stop


// ---------------------- FUNZIONI PER LE SCUOLE ----------------------

// Funzione per aggiungere una nuova scuola
function addSchoolToUI(newId) {
  const newSchoolUI = {
    id: newId,
    name: newSchool.value.name,
  };
  
  schools.value[newId] = newSchoolUI;
}

// Funzione per modificare una scuola
function editSchool(index) {
  const newName = prompt('Inserisci il nuovo nome della scuola:');
  if (newName) {
    schools.value[index].name = newName;
  }
}

async function deleteSchoolUI(id) {
  // Inizializziamo l'indice a -1
  let confirmDelete = confirm('Sei sicuro di voler eliminare questa scuola?');

  if (!confirmDelete) {
    return;
  }

  let index = -1;

  // Iteriamo sull'oggetto schools.value
  for (let key in schools.value) {
    // Controlliamo se l'ID corrente corrisponde all'ID della scuola da eliminare
    if (schools.value[key].id === id) {
      // Se la condizione è vera, assegniamo l'indice corrente a index
      index = key;
      // Usciamo dal ciclo, dato che abbiamo trovato l'elemento da eliminare
      break;
    }
  }

  // Verifichiamo se abbiamo trovato l'elemento
  if (index !== -1) {
    console.log('lineId', schools.value[index]);
    // Elimino eventuali linee
    for (let line of schools.value[index].lines) {
      await deleteLineUI(line.id, false);
    }
    
    //Eliminiamo l'elemento utilizzando la chiave trovata
    const response = await deleteSchool(schools.value[index].id);
    console.log(response);
    if (response.success){
      delete schools.value[index];
    }
    else {
      console.error('Error deleting school:', response.error);
    }
  }
}

// Funzione per espandere/contrarre la scuola
function toggleExpansion(schoolId) {
  expandedSchool.value = expandedSchool.value === schoolId ? null : schoolId;
}

function openCreationDialogSchool() {
  dialogSchool.value = true;
}

function closeDialogSchool() {
  dialogSchool.value = false;
  newSchool.value = {
    name: '',
    lat: '',
    lng: '',
  };
}

async function saveSchool() {

  if (!formSchool.value.validate() || !validSchool.value) {
    return;
  }

  let body = {
    name: newSchool.value.name,
    position: [newSchool.value.lat, newSchool.value.lng],
  };

  try {
    const response = await createSchool(body);
    addSchoolToUI(response._id); // Passa la scuola creata alla funzione
    closeDialogSchool();
  } catch (error) {
    console.error('Error creating school:', error);
  }
}



// ---------------------- FUNZIONI PER LE LINEE ----------------------

function openCreationDialogLine(schoolId) {
  selectedSchoolForCreation.value = schoolId;
  dialogLine.value = true;
}

function closeDialogLine() {
  dialogLine.value = false;
  newLine.value = {
    name: '',
    color: '',
  };
}

async function saveLine() {
  if (!formLine.value.validate() || !validLine.value) {
    return;
  }

  // SALVO LINEA SU DB (POST REQUEST)
  let body = {
    name: newLine.value.name,
    color: newLine.value.color,
    schoolId: selectedSchoolForCreation.value,
  };

  const responseLine = await createLine(body);

  // AGGIUNGO LINEA ALLA SCUOLA
  const SchoolNowResponse = await fetchSchoolFromId(selectedSchoolForCreation.value);


  const updatedSchoolBody = {
    "linesId": SchoolNowResponse.linesId.concat(responseLine._id),
  };

  const updateSchoolResponse = await updateSchool(selectedSchoolForCreation.value, updatedSchoolBody);

  closeDialogLine();

  console.log('Linea aggiunta:', responseLine);
  
  schools.value = await fetchSchoolsFull();

}

async function deleteLineUI(id, msg=true) {

  if(msg){
    let confirmDelete = confirm('Sei sicuro di voler eliminare questa linea?');

    if (!confirmDelete) {
      return;
    }
  }
  

  // RIMUOVO LINEA DALLA SCUOLA
  const line = await fetchLineFromId(id);   // ottengo la linea da eliminare (per ottenere l'id della scuola)
  console.log('line api: ', line);
  const school = await fetchSchoolFromId(line.schoolId);   // ottengo la scuola della linea
  
  const newLinesId = school.linesId.filter((lineId) => lineId !== id);  // rimuovo la linea dall'array di linee della scuola

  const updatedSchoolBody = {
    "linesId": newLinesId,
  };

  // ELIMINO EVENTUALI FERMATE
  for (let stopId of line.stops) {
    await deleteStop(stopId);
  }

  console.log('schoolID', school.id);
  console.log('updatedSchoolBody', updatedSchoolBody);
  await updateSchool(school.id, updatedSchoolBody);  // aggiorno la scuola

  deleteLine(id);  // elimino la linea dal db

  schools.value = await fetchSchoolsFull();
  console.log('deleted line', id);
}

// ---------------------- FUNZIONI PER LE FERMATE ----------------------
function openDialogFermate(line) {
  dialogFermate.value = true; // Apre il dialog della timeline
  selectedLine.value = line; // Imposta la linea selezionata
  console.log('selectedLine', selectedLine.value);
}

function closeDialogFermate() {
  dialogFermate.value = false; // Chiude il dialog della timeline
}

function openCreationDialogFermata() {
  dialogCreaFermata.value = true; // Apre il dialog per la creazione di una nuova fermata
}

function closeCreationDialogFermata() {
  dialogCreaFermata.value = false; // Chiude il dialog per la creazione di una nuova fermata
  newStop.value = {
    name: '',
    schedule: '',
    lat: '',
    lng: '',
  };
}

async function saveStop() {
  if (!formStop.value.validate() || !validStop.value) {
    return;
  }

  // SALVO FERMATA SU DB (POST REQUEST)
  let body = {
    name: newStop.value.name,
    schedule: newStop.value.schedule,
    position: [newStop.value.lat, newStop.value.lng],
    line: selectedLine.value.id,
  };

  const responseStop = await createStop(body);

  selectedLine.value.stops.push(body);      // aggiungo nuovo elemento ad ui (così non serve fare refresh)

  // Leggo la fermata dal db e la aggiungo alla timeline
  const line = await fetchLineFromId(selectedLine.value.id);
  line.stops.push(responseStop._id);


  // UPDATE LINEA SU DB (PUT REQUEST)
  const responseLine = await updateLine(selectedLine.value.id, { stops: line.stops });


  closeCreationDialogFermata();
}

async function deleteStopUI(stop) {
  let confirmDelete = confirm('Sei sicuro di voler eliminare questa fermata?');

  if (!confirmDelete) {
    return;
  }

  // Rimuovi la fermata dalla timeline
  console.log('Fermata eliminata:', stop.id);

  // la linea è selectedLine.value dato che il dialog delle fermate è aperto solo se una linea è selezionata
  // UPDATE LINEA SU DB (PUT REQUEST)
  const newStops = selectedLine.value.stops.filter((s) => s.id !== stop.id);
  selectedLine.value.stops = newStops;
  const response = await updateLine(selectedLine.value.id, { stops: newStops });

  console.log('response', response);

  // Rimuovi la fermata dal db
  await deleteStop(stop.id);
}

// ---------------------- ON MOUNTED ----------------------
const router = useRouter();
  
onMounted(async () => {
  await fetchToken();
  
  console.log('Logged user:', loggedUser); // Debugging log
  console.log('RUOLO', loggedUser.role);

 
  if(!loggedUser.token || loggedUser.role !== 'admin'){
    router.push('/');
  }


  
  try {
    loading.value = true;
    schools.value = await fetchSchoolsFull();
    console.log('schools', schools.value);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching schools:', error);
  }
});
</script>

<style>
  .edit-icon{
    margin-right: 5px;
  }

  .edit-icon:hover .v-icon {
    color: #00b9ae;
  }

  .delete-icon:hover .v-icon {
    color: rgb(250, 83, 83);
  }

  .add-icon:hover .v-icon {
    color: #ffb82a;
  }

  .stops-icon:hover .v-icon {
    color: #a11df2;
  }

  .rotate-180 {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }
</style>
