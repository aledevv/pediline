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
                            <v-text-field label="Email*" color="primary" v-model="email" required></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6" md="12" sm="6">
                            <v-text-field label="Ruolo*" color="primary" v-model="role" required></v-text-field>
                        </v-col>

                        <v-col cols="auto" sm="6">
                            <v-select :items="lines" label="Linea*" color="primary" v-model="line" required></v-select>
                        </v-col>

                        <v-col cols="auto" sm="6">
                            <v-select :items="stops" label="Fermata*" color="primary" v-model="stop" required></v-select>
                        </v-col>
                    </v-row>

                    <small class="text-caption text-medium-emphasis">*campo obbligatorio</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
                    <v-btn color="primary" text="Save" variant="tonal" @click="dialog = false"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { ref, onBeforeMount, watchEffect } from 'vue';
import { loggedUser } from '@/states/loggedUser';
import { fetchStops, fetchLines } from '@/views/utils/apiFetch.js';

export default {
    setup() {
        const email = ref('');
        const role = ref('');
        const line = ref('');
        const stop = ref('');

        const lines = ref([]);
        const stops = ref([]);
        const dialog = ref(false);



        onBeforeMount(async () => {
            await fetchLines(lines);
            await fetchStops(stops);
        });

        watchEffect(() => {
            email.value = loggedUser.email;
            role.value = loggedUser.role;
            line.value = loggedUser.line_id;
            stop.value = loggedUser.stop_id;
            console.log("LoggedUser updated - Email:", loggedUser.email);
            console.log("LoggedUser updated - Role:", loggedUser.role);
            console.log("LoggedUser updated - Line:", loggedUser.line_id);
            console.log("LoggedUser updated - Stop:", loggedUser.stop_id);
        });

        return {
            dialog,
            email,
            role,
            line,
            stop,
            lines,
            stops
        };
    }
};
</script>
