<template>
        <v-app-bar
          color="primary"
          persistent
        >
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  
          <v-toolbar-title></v-toolbar-title>
  
          <v-spacer></v-spacer>
  
          <template v-if="$vuetify.display.mdAndUp">
            <v-btn icon="mdi-magnify" variant="text"></v-btn>
  
            <v-btn icon="mdi-filter" variant="text"></v-btn>
          </template>
  
          <v-dialog
            v-model="dialog"
            max-width="600"
            >
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    icon="mdi-account"
                    v-bind="activatorProps"
                    class="mr-4"
                ></v-btn>
            </template>

            <v-card
                prepend-icon="mdi-account"
                title="User Profile"
            >
                <v-card-text>
                    <v-row dense>
                        <v-col
                            cols="12"
                            md="12"
                            sm="6"
                        >
                            <v-text-field
                                label="Nome e cognome genitore*"
                                color="primary"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <p class="text-caption text-medium-emphasis mb-2">Informazioni studente</p>

                    <v-row>
                        
                        <v-col
                            cols="6"
                            md="12"
                            sm="6"
                        >
                            <v-text-field
                                label="Nome e cognome studente*"
                                color="primary"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>  
                        <v-col
                            cols="6"  
                        >
                            <v-select
                                :items=lines
                                label="Linea*"
                                color="primary"

                                required
                            ></v-select>
                        </v-col>

                        <v-col
                            cols="6"
                        >
                            <v-select
                                :items=fermate
                                label="Fermate*"
                                color="primary"
                                required
                            ></v-select>
                        </v-col>
                    </v-row>

                        <small class="text-caption text-medium-emphasis">*campo obbligatorio</small>
                </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            text="Close"
                            variant="plain"
                            @click="dialog = false"
                        ></v-btn>

                        <v-btn
                            color="primary"
                            text="Save"
                            variant="tonal"
                            @click="dialog = false"
                        ></v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-app-bar>
  
        <v-navigation-drawer
          v-model="drawer"
          :location="$vuetify.display.mobile ? 'bottom' : undefined"
          temporary
        >
        
        <v-list-item
            v-for="[icon, text, route] in links"
            :key="icon"
            :prepend-icon="icon"
            :title="text"
            :to="route"
            link
            class="pa-5"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            to="/logout"
            link
            class="pa-5"
          ></v-list-item>

        </v-navigation-drawer>
  </template>
  <script>


    const links = [
        ['mdi-home', 'Home', '/'],
        ['mdi-map', 'Linee', '/linee'],
        ['mdi-calendar', 'Calendario', '/calendario'],
        // account e logout sono fatti a parte
    ]

    const lines = [
        "Martignano", "Povo", "Villazzano", "Gardolo", "Trento", "Rovereto", "Pergine Valsugana", "Arco", "Riva del Garda", "Mori", "Mezzolombardo", "Cles", "Borgo Valsugana", "Rovereto", "Trento", "Pergine Valsugana", "Arco", "Riva del Garda", "Mori", "Mezzolombardo", "Cles", "Borgo Valsugana"
    ]

    const fermate = [ // deve essere dipendente da lines
        "Piazza Dante", "Piazza Fiera", "Piazza Venezia", "Piazza Duomo", "Piazza Vittoria", "Piazza Garibaldi", "Piazza Doss Trento", "Piazza Doss Rovereto", "Piazza Doss Pergine", "Piazza Doss Arco", "Piazza Doss Riva", "Piazza Doss Mori", "Piazza Doss Mezzolombardo", "Piazza Doss Cles", "Piazza Doss Borgo"
    ]

    export default {
      data: () => ({
        drawer: false,
        group: null,
        links: links,
        dialog: false,
        lines: lines,
        fermate: fermate
      }),
  
      watch: {
        group () {
          this.drawer = false
        },
      },
    }
  </script>