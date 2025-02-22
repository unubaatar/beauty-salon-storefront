<template>
  <v-layout>
    <v-app-bar style="background-color: pink; width: 100%" elevation="0">
      <section class="d-flex w-100 justify-center">
        <div
          class="d-flex justify-space-between align-center"
          style="max-width: 960px; width: 100%"
        >
          <img
            style="height: 48px; width: 48px; object-fit: cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIIWju1ABYrb5DTkZ8mbDcaAekrgKnjmf0CA&s"
            alt=""
          />

          <v-text-field
            density="compact"
            placeholder="Хайх"
            append-inner-icon="mdi-magnify"
            style="padding-bottom: 0; background-color: white"
            max-width="300"
            variant="outlined"
            hide-details
          ></v-text-field>

          <div>
            <v-btn @click="showLoginDialog = true" color="white">
              <v-icon class="mr-2">mdi-account</v-icon> <span>Профайл</span>
            </v-btn>
          </div>
        </div>
      </section>
    </v-app-bar>

    <v-dialog v-model="showLoginDialog" width="400">
        <v-card class="pa-6">
            <div class="text-center mb-4" style="font-weight: 550; font-size: 24px;">Нэвтрэх</div>
            <v-text-field v-model="loginDetails.phone" variant="outlined" label="Утасны дугаар"></v-text-field>

            <v-text-field v-model="loginDetails.password" variant="outlined"  label="Нууц үг" ></v-text-field>

            <v-btn @click="login()"  color="pink">
                Нэвтрэх
            </v-btn>

        </v-card>
    </v-dialog>

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import axios from "axios";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const showLoginDialog = ref<any>(false);
const loginDetails = ref<any>({});

const login = async() => {
    try {   
        const response = await axios.post(`${baseURL}/customers/login` , loginDetails.value);
        if(response.status === 200) {
            localStorage.setItem("customerId" , response.data.customer );
            showLoginDialog.value = false;
        } else {
            console.log("jiijiii");
        }
    } catch(err) {
        console.log(err);
    }
}

onMounted(() => {});
</script>

<style scoped></style>
