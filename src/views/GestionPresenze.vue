<template>
    <v-app id="inspire">

      <!-- Navigation Drawer -->
      <NavigationDrawer />

  
      <v-main>
        <v-container flexible class="ma-2">
          <h1>Gestione presenze</h1>

          <v-dialog max-width="500" v-model="dialog">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                class="mt-5"
                v-bind="activatorProps"
                color="primary"
                text="Segnala assenza"
                ></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card>
                <v-date-picker 
                  class="mx-auto"
                  color="primary"
                  title="Seleziona la data di assenza"
                  locale="it"
                  width="100%"
                  v-model="date"
                ></v-date-picker>
                <v-card-actions>
                  <v-spacer></v-spacer>


                  <v-btn
                    id="ConfirmButton"
                    text="Conferma"
                    color="primary"
                    variant="text"
                    @click="addAssenza"
                  ></v-btn>

                  <v-btn
                    text="Chiudi"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-row class="ma-1">
            

          </v-row>

          



          <v-infinite-scroll
            height="400"
            @load="load"
          >
            <template v-for="(day, index) in assenze" :key="day">
              <v-list-item
                :title="day.data"
              >
                <template v-slot:prepend>
                  <v-icon color="red-darken-2">mdi-account-remove</v-icon>
                </template>

                <template v-slot:append>
                  <v-btn
                    class="delete-btn"
                    color="grey-lighten-1"
                    icon="mdi-delete"
                    variant="text"
                    @click="removeAssenza(index)"
                  ></v-btn>
                </template>
                
              </v-list-item>
              <v-divider inset></v-divider>
            </template>
            <template v-slot:empty>
              <v-alert type="warning" variant="tonal">Non sono presenti altri elementi</v-alert>
            </template>
          </v-infinite-scroll>


        </v-container>
      
    
        

      </v-main>
    </v-app>
  </template>
  
<script setup >
  import NavigationDrawer from '@/components/NavigationDrawer.vue'

  import { useLocale } from 'vuetify'
  import { ref } from 'vue'

  const { current } = useLocale()

  function changeLocale (locale) {
    current.value = locale
  }

  // per poi chiudere il dialog
  const dialog = ref(false);


  // per InfiniteScroll
  const assenze = ref([
    {"data":"1 Gennaio 2024"},
    {"data":"2 Gennaio 2024"},
    {"data":"3 Gennaio 2024"},
    {"data":"4 Gennaio 2024"},
    {"data":"5 Gennaio 2024"},
    {"data":"6 Gennaio 2024"},
    {"data":"7 Gennaio 2024"},
    {"data":"8 Gennaio 2024"},
    {"data":"9 Gennaio 2024"},
    {"data":"10 Gennaio 2024"},
    {"data":"11 Gennaio 2024"},
    {"data":"12 Gennaio 2024"},
    {"data":"13 Gennaio 2024"},
    {"data":"14 Gennaio 2024"},
    {"data":"15 Gennaio 2024"},
    {"data":"16 Gennaio 2024"},
    {"data":"17 Gennaio 2024"},
    {"data":"18 Gennaio 2024"},
    {"data":"19 Gennaio 2024"},
    {"data":"20 Gennaio 2024"},
    {"data":"21 Gennaio 2024"},
    {"data":"22 Gennaio 2024"},
    {"data":"23 Gennaio 2024"},
    {"data":"24 Gennaio 2024"},
    {"data":"25 Gennaio 2024"},
    {"data":"26 Gennaio 2024"},
    {"data":"27 Gennaio 2024"},
    {"data":"28 Gennaio 2024"},
    {"data":"29 Gennaio 2024"},
    {"data":"30 Gennaio 2024"},
    {"data":"31 Gennaio 2024"},
  ]);

  // per DatePicker
  const date = ref(new Date());

  function addAssenza() {
    assenze.value.push({data: date.value.toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})});
    dialog.value = false;
  }

  function removeAssenza(index) {
    assenze.value.splice(index, 1);
  }
</script>

<script>
  export default {
      data: () => ({
      }),

      methods: {
        load ({ done }) {
          setTimeout(() => {
            done('empty')
          }, 1000)
        },
      },
    }
</script>

<style>

.delete-btn:hover .v-icon{
  color: #E57373;
}

.delete-btn:hover{
  background-color: #FFEBEE;
}
</style>