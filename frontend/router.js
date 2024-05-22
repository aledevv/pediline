// src/router.js
import Vue from 'vue';
import Router from 'vue-router';
import App from './components/App.vue';
//import About from './components/About.vue';
import Map from './components/MapView.vue'; // Importa il componente Map

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/map', // Aggiungi la rotta per Map
      name: 'Map',
      component: Map
    }
  ]
});
