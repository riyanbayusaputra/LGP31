// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())  // ← ini yang penting, harus ada!

app.mount('#app')