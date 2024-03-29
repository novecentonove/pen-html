import './assets/github-markdown-dark.css'
import './assets/main.css'
/* hightlight css*/ 
import './assets/highlight/atom-one-dark.css'
// //import './assets/highlight/github-dark.css'
// import './assets/highlight/tokyo-night-dark.css'

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
