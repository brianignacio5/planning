import "./assets/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCalendarDay,
  faCog,
  faEdit,
  faPlus,
  faTimes,
  faThLarge,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

library.add(faCalendarDay, faCog, faEdit, faPlus, faTimes, faThLarge, faUsers);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("faIcon", FontAwesomeIcon);

app.mount("#app");
