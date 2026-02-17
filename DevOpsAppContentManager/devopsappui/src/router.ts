import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "@/views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: DashboardView },
    { path: "/projects", name: "projects", component: () => import("@/views/ProjectsView.vue") },
    {
      path: "/projects/new",
      component: () => import("@/views/ProjectCreateView.vue"),
    }
  ],
});

export default router;
