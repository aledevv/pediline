import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ListaPresenze from '../views/ListaPresenze.vue'
import GestionePresenze from '../views/GestionePresenze.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [  // definisce le routes dell'applicazione
  {
    path: '/',
    name: 'home',
    component: Home // importa il componente Home
  },
  {
    path: '/lista-presenze',
    name: 'ListaPresenze',
    component: ListaPresenze // importa il componente GestionePresenze
  },
  {
    path: '/presenze',
    name: 'presenze',
    component: GestionePresenze
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel
  },

  // catch all 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({ // crea il router
  history: createWebHistory(process.env.BASE_URL), // crea la history
  routes // passa le routes
})

export default router 
