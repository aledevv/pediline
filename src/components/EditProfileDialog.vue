<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn icon="mdi-account" v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Profilo utente">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="12" sm="6">
                            <v-text-field label="Email*" color="primary" v-model="email" readonly required></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6" md="12" sm="6">
                            <v-text-field label="Ruolo*" color="primary" v-model="role" readonly required></v-text-field>
                        </v-col>
                        <v-col cols="6" md="12" sm="6">
                            <v-select :items="schoolDropdown" label="Scuola*" color="primary" v-model="selectedSchool" required></v-select>
                        </v-col>

                        <v-col cols="auto" sm="6">
                            <v-select :items="lineDropdown" label="Linea*" color="primary" v-model="selectedLine" required></v-select>
                        </v-col>

                        <v-col cols="auto" sm="6">
                            <v-select :items="stopDropdown" label="Fermata*" color="primary" v-model="selectedStop" required></v-select>
                        </v-col>
                    </v-row>

                    <small class="text-caption text-medium-emphasis">*campo obbligatorio</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
                    <v-btn color="primary" text="Save" variant="tonal" @click="saveChanges"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { ref, onBeforeMount, watchEffect, watch } from 'vue';
import { loggedUser } from '@/states/loggedUser';
import { fetchStops, fetchLines, fetchSchools, fetchLineFromId, fetchStopFromId, updateUserInfo } from '@/views/utils/apiFetch.js';
import { data } from '@maptiler/sdk';

export default {
    setup() {
        const email = ref('');
        const role = ref('');
        const line = ref('');
        const stop = ref('');

        
        const stops = ref([]);
        let dialog = ref(false);

        let dataDictionary = ref({});  // dizionario key = nome linea, value = id linea
        let schoolDropdown = ref([]);
        let lineDropdown = ref([]);
        let stopDropdown = ref([]);
        let selectedSchool = ref('');       
        let selectedLine = ref('');
        let selectedStop = ref('');

        let isFetching = false;

        async function createDictionary(schools) {
            let dictionary = {};
            
            for (let school in schools){
                dictionary[schools[school].id] = {name: schools[school].name};

                // aggiungo le linee della scuola
                dictionary[schools[school].id].lines = {};
                for (let line in schools[school].linesId){
                    let lineResponse = await fetchLineFromId(schools[school].linesId[line]);
                    dictionary[schools[school].id].lines[schools[school].linesId[line]] = {name: lineResponse.name, stops: {}};
                    
                    // aggiungo le fermate della linea
                    for (let stop in lineResponse.stops){
                        let stopResponse = await fetchStopFromId(lineResponse.stops[stop]);
                        dictionary[schools[school].id].lines[schools[school].linesId[line]].stops[lineResponse.stops[stop]] = {name: stopResponse.name};
                    }
                }
            }
            
            return dictionary;
        }

        async function getSchoolDropDown(){
            let schools = [];
            for (let school in dataDictionary.value){
                schools.push(dataDictionary.value[school].name);
            }
            schoolDropdown.value = schools;
        }

        async function getLinesDropdown(){

            if(!isFetching) selectedLine.value = '';
            
            // ottengo id scuola selezionata
            let selectedSchoolId = '';
            for (let school in dataDictionary.value){
                if (dataDictionary.value[school].name == selectedSchool.value){
                    selectedSchoolId = school;
                    break;
                }
            }


            
            let lines = [];
            for (let line in dataDictionary.value[selectedSchoolId].lines){
                lines.push(dataDictionary.value[selectedSchoolId].lines[line].name);
            }

            lineDropdown.value = lines;
        }

        async function getStopsDropdown(){

            if(!isFetching) selectedStop.value = '';

            if(selectedLine.value == '') return;

            // ottengo id scuola selezionata
            let selectedSchoolId = '';
            for (let school in dataDictionary.value){
                if (dataDictionary.value[school].name == selectedSchool.value){
                    selectedSchoolId = school;
                    break;
                }
            }

            // ottengo id linea selezionata
            let selectedLineId = '';
            for (let line in dataDictionary.value[selectedSchoolId].lines){
                if (dataDictionary.value[selectedSchoolId].lines[line].name == selectedLine.value){
                    selectedLineId = line;
                    break;
                }
            }

            let stops = [];
            for (let stop in dataDictionary.value[selectedSchoolId].lines[selectedLineId].stops){
                stops.push(dataDictionary.value[selectedSchoolId].lines[selectedLineId].stops[stop].name);
            }

            stopDropdown.value = stops;
        }

        async function closeDialog(){
            dialog.value = false;
        }

        async function openDialog(){
            dialog.value = true;
        }

        async function saveChanges(){
            let schoolId = '';

            // ottengo id scuola selezionata
            for (let school in dataDictionary.value){
                if (dataDictionary.value[school].name == selectedSchool.value){
                    schoolId = school;
                    break;
                }
            }

            // ottengo id linea selezionata
            let lineId = '';
            for (let line in dataDictionary.value[schoolId].lines){
                if (dataDictionary.value[schoolId].lines[line].name == selectedLine.value){
                    lineId = line;
                    break;
                }
            }

            // ottengo id fermata selezionata
            let stopId = '';
            for (let stop in dataDictionary.value[schoolId].lines[lineId].stops){
                if (dataDictionary.value[schoolId].lines[lineId].stops[stop].name == selectedStop.value){
                    stopId = stop;
                    break;
                }
            }

            let body = {
                school: schoolId,
                line: lineId,
                stop: stopId
            };

            console.log("user now:", loggedUser);

            let response = await updateUserInfo(loggedUser.id, body);

            closeDialog();
        }

        onBeforeMount(async () => {

            //if(loggedUser.token && loggedUser.line_id!=undefined && loggedUser.school_id!=undefined  && loggedUser.stop_id!=undefined ){ 
                isFetching = true;
                let response = await fetchSchools();
                dataDictionary.value = await createDictionary(response);
                console.log("DICT:", dataDictionary.value);                           // DIZIONARIO SCUOLE
                selectedSchool.value = dataDictionary.value[loggedUser.school_id].name;
                selectedLine.value = dataDictionary.value[loggedUser.school_id].lines[loggedUser.line_id].name;
                selectedStop.value = dataDictionary.value[loggedUser.school_id].lines[loggedUser.line_id].stops[loggedUser.stop_id].name;
                await getSchoolDropDown();
                isFetching = false;
           // }
        });




        // controllo se la scuola selezionata è cambiata
        watch(selectedSchool, (newValue) => {
            getLinesDropdown();
        }
        );

        watch(selectedLine, (newValue) => {
            getStopsDropdown();
        });



        watchEffect(() => {
            email.value = loggedUser.email;
            role.value = loggedUser.role;
            line.value = loggedUser.line_id;
            stop.value = loggedUser.stop_id;
            // console.log("LoggedUser updated - Email:", loggedUser.email);
            // console.log("LoggedUser updated - Role:", loggedUser.role);
            // console.log("LoggedUser updated - School:", loggedUser.school_id);
            // console.log("LoggedUser updated - Line:", loggedUser.line_id);
            // console.log("LoggedUser updated - Stop:", loggedUser.stop_id);
        });

        return {
            dialog,
            email,
            role,
            line,
            stop,
            selectedSchool,
            selectedLine,
            selectedStop,
            stops,
            schoolDropdown,
            lineDropdown,
            stopDropdown,
            saveChanges,
            closeDialog
        };
    }
};
</script>
