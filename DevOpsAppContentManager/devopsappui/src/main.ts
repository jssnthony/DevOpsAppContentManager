import '@/assets/main.css'
import "@/assets/styles/base.css";
import "@/assets/styles/card-variants.css";

import router from "./router";

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(router).mount('#app')
