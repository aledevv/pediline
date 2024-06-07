import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { state } from '@/state.js'


loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .provide('state', state)
  .mount('#app')
