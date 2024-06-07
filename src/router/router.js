import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Lines from '../views/Lines.vue'
import ListaPresenze from '../views/ListaPresenze.vue'
import Logout from '../views/Logout.vue'
import GestionePresenze from '../views/GestionPresenze.vue'
import Login from '../views/Login.vue' 
import Signup from '../views/Signup.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [  // definisce le routes dell'applicazione
  {
    path: '/',
    name: 'home',
    component: Home // importa il componente Home
  },
  {
    path: '/linee',
    name: 'linee',
    component: Lines
  },
  {
    path: '/lista-presenze',
    name: 'lista-presenze',
    component: ListaPresenze
  },
  {
    path: '/presenze',
    name: 'presenze',
    component: GestionePresenze
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
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
