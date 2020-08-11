import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendarDay, faCog, faEdit, faPlus, faTimes, faThLarge, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vueCookies from "vue-cookies";
import VueRouter from "vue-router";
import Calendar from "./components/Calendar.vue";
import Projects from "./components/Projects.vue";
import ProjectPage from "./components/Project.vue";
import Settings from "./components/Settings.vue";
import Teams from "./components/Teams.vue";

library.add(faCalendarDay, faCog, faEdit, faPlus, faTimes, faThLarge, faUsers);
Vue.component("faIcon", FontAwesomeIcon);

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    { name: "calendar", path: "/calendar", component: Calendar },
    { name: "home", path: "/", component: Projects },
    { name: "project", path: "/project", component: ProjectPage },
    { name: "settings", path: "/settings", component: Settings },
    { name: "teams", path: "/teams", component: Teams }
  ]
});

Vue.use(vueCookies);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
