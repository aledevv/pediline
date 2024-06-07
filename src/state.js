// src/state.js
import { reactive } from 'vue'

export const state = reactive({
  role: 'g', // Inizialmente impostato a 'none', cambia secondo necessità
  user: {
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnN8ZW58MHx8MHx8&w=1000&q=80'
  }
})

export function setRole(newRole) {
  state.role = newRole
}

