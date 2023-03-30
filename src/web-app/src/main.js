import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/tailwind.css";
import 'tippy.js/dist/tippy.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
