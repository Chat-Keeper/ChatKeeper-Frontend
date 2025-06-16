import './assets/main.css'
import 'primeicons/primeicons.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode-selector',
    }
  }
})

app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
