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
    },
    {
      path: "/projects/:id",
      component: () => import("@/views/ProjectEditView.vue"),
    },
    {
      path: "/tasks",
      component: () => import("@/views/TasksView.vue"),
    },
    {
      path: "/projects/:projectId/tasks/create",
      component: () => import("@/views/TaskCreateView.vue")
    },
    {
      path: "/cards",
      component: () => import("@/views/inventories/CardsView.vue"),
    },
    {
      path: "/cards/new",
      component: () => import("@/views/inventories/CardsCreateView.vue"),
    }
  ],
});

export default router;
