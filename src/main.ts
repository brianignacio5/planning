import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendarDay, faCog, faEdit, faPlus, faTimes, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vueCookies from "vue-cookies";
import VueRouter from "vue-router";
import ProjectPage from "./components/Project.vue";

library.add(faCalendarDay, faCog, faEdit, faPlus, faTimes, faThLarge);
Vue.component("faIcon", FontAwesomeIcon);

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    { name: "project", path: "/", component: ProjectPage },
  ]
});

Vue.use(vueCookies);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
