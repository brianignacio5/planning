import { createRouter, createWebHistory } from "vue-router";
import Calendar from "@/views/Calendar.vue";
import Projects from "@/views/Home.vue";
import ProjectPage from "@/views/Project.vue";
import Settings from "@/views/Settings.vue";
import Teams from "@/views/Teams.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: "calendar", path: "/calendar", component: Calendar },
    { name: "home", path: "/", component: Projects },
    { name: "project", path: "/project/:id", component: ProjectPage },
    { name: "settings", path: "/settings", component: Settings },
    { name: "teams", path: "/teams", component: Teams },
  ],
});

export default router;
