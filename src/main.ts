import './assets/github-markdown-dark.css'
import './assets/main.css'
/* hightlight css*/ 
import './assets/atom-one-dark.css'
//import './assets/github-dark.css'
// import './assets/tokyo-night-dark.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
// import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
// app.use(router)

app.mount('#app')
