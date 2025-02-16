export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.client) {
      if (!localStorage.getItem("userId")) {
        return navigateTo("/auth");
      }
    }
  });
  