import 'water.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
// TODO: add pinia colada
app.use(router)

app.mount('#app')
