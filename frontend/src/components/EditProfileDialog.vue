<template>
    <div class="pa-4 text-center">
        <v-dialog
        v-model="dialog"
        max-width="600"
        >
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                icon="mdi-account"
                v-bind="activatorProps"
            ></v-btn>
        </template>

        <v-card
            prepend-icon="mdi-account"
            title="Profilo utente"
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

                    
                    <v-col
                        cols="auto"
                        sm="6"
                    >
                        <v-select
                            :items=lines
                            label="Linea*"
                            color="primary"
                            required
                        ></v-select>
                    </v-col>

                    <v-col
                        cols="auto"
                        sm="6"
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
    </div>
</template>

<script>

    const lines = [
        "Martignano", "Povo", "Villazzano", "Gardolo", "Trento", "Rovereto", "Pergine Valsugana", "Arco", "Riva del Garda", "Mori", "Mezzolombardo", "Cles", "Borgo Valsugana", "Rovereto", "Trento", "Pergine Valsugana", "Arco", "Riva del Garda", "Mori", "Mezzolombardo", "Cles", "Borgo Valsugana"
    ]

    const fermate = [ // deve essere dipendente da lines
        "Piazza Dante", "Piazza Fiera", "Piazza Venezia", "Piazza Duomo", "Piazza Vittoria", "Piazza Garibaldi", "Piazza Doss Trento", "Piazza Doss Rovereto", "Piazza Doss Pergine", "Piazza Doss Arco", "Piazza Doss Riva", "Piazza Doss Mori", "Piazza Doss Mezzolombardo", "Piazza Doss Cles", "Piazza Doss Borgo"
    ]

    export default {
        data: () => ({
            dialog: false,
            lines: lines,
            fermate: fermate
        }),
    }

    
</script>