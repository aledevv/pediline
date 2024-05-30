import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [  // definisce le routes dell'applicazione
  {
    path: '/',
    name: 'home',
    component: Home // importa il componente Home
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
