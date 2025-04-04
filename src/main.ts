import 'water.css'
import { createApp } from 'vue'
import { PiniaColada, type PiniaColadaOptions } from '@pinia/colada'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {
  queryOptions: {},
} satisfies PiniaColadaOptions)
app.use(router)

app.mount('#app')
