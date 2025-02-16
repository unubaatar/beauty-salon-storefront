// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["vuetify-nuxt-module", "@pinia/nuxt"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      baseURL: "http://localhost:4004/api/v1",
    },
  },
  devServer: {
    port: 3000,
  },
});
