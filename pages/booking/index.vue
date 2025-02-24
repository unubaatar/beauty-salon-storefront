<template>
  <div class="d-flex justify-center w-100">
    <div style="max-width: 1080px; width: 100%; min-height: 100vh">
      <div class="d-flex justify-center">
        <div class="d-flex align-center">
          <v-btn variant="outlined" color="pink" icon="">1</v-btn>
          <div style="height: 3px; width: 40px; background: #e91e63"></div>
          <v-btn variant="outlined" color="pink" icon="">2</v-btn>
          <div style="height: 3px; width: 40px; background: #e91e63"></div>
          <v-btn variant="outlined" color="pink" icon="">3</v-btn>
          <div style="height: 3px; width: 40px; background: #e91e63"></div>
          <v-btn variant="outlined" color="pink" icon="">4</v-btn>
        </div>
      </div>

      <v-row>
        <v-col cols="12" md="7" v-if="step == 0">
          <v-slide-group v-model="selectedIndex" class="mt-4">
            <v-slide-group-item
              v-for="(category, index) in categories"
              v-slot="{ isSelected, toggle }"
            >
              <v-btn
                :class="isSelected ? 'selectedClass' : 'border : none'"
                :variant="isSelected ? 'flat' : 'text'"
                rounded="pill"
                @click="
                  selectedIndex = index;
                  selectedCategory = category._id;
                  fetchServices();
                "
                style="
                  height: 32px;
                  border-radius: 4px;
                  border: 1px solid #e91e63;
                  font-size: 12px;
                "
                class="mx-2"
              >
                {{ category.title }}
              </v-btn>
            </v-slide-group-item>
          </v-slide-group>

          <div>
            <v-card
              style="cursor: pointer; max-height: 160px"
              v-for="service in services"
              class="pa-4 my-4 d-flex justify-space-between align-center"
              :style="
                checkItemOnCart(service)
                  ? 'border: 2px solid #e91e63; background-color:   #ffcccc '
                  : ''
              "
              variant="outlined"
              rounded="lg"
            >
              <div style="max-height: 160px" class="d-flex">
                <img
                  style="
                    height: 100%;
                    max-height: 128px;
                    max-width: 128px;
                    aspect-ratio: 1;
                    object-fit: cover;
                  "
                  :src="service.image"
                  alt=""
                />

                <div
                  class="ml-4 d-flex flex-column justify-space-between"
                  style="height: 128px"
                >
                  <article>
                    <div>{{ service.title }}</div>
                    <div>
                      <span style="margin-right: 2px">{{
                        service.duration
                      }}</span>
                      минут
                    </div>
                  </article>

                  <div>
                    <span class="mr-1">Үнэ: </span>
                    {{ service.price.toLocaleString() }}₮
                  </div>
                </div>
              </div>

              <v-btn
                v-if="!checkItemOnCart(service)"
                @click="addToServiceCart(service)"
                elevation="0"
                variant="tonal"
                size="small"
                rounded="lg"
                icon="mdi-plus"
              ></v-btn>

              <v-btn
                v-if="checkItemOnCart(service)"
                @click="removeItemFromServiceCart(service)"
                elevation="0"
                variant="flat"
                size="small"
                rounded="lg"
                icon="mdi-delete"
                color="pink"
              ></v-btn>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" md="7" v-if="step == 1">
          <div
            class="text-center my-4"
            style="font-weight: 550; font-size: 20px"
          >
            Та үйлчилгээ авах ажилтанаа сонгоно уу.
          </div>

          <v-row>
            <v-col v-for="worker in workersByServices" cols="12" md="4">
              <v-card
                :style="
                  checkSelectedWorker(worker)
                    ? 'border: 2px solid #e91e63; background-color:  #e6e6e6 '
                    : ''
                "
                @click="selectedWorker = worker"
                variant="outlined"
                class="pa-4 d-flex justify-center align-center flex-column"
                style="min-height: 150px; cursor: pointer"
              >
                <img
                  style="
                    height: 60px;
                    width: 60px;
                    object-fit: cover;
                    border-radius: 50%;
                  "
                  :src="worker.avatar"
                  alt=""
                />
                <p
                  class="mt-1"
                  style="font-size: 16px;  font-weight: 550"
                  :style=" checkSelectedWorker(worker) ? 'color: black' : ''"
                >
                  {{ worker.firstName }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="5">
          <v-card
            style="min-height: 400px"
            rounded="lg"
            class="mt-4 pa-4 d-flex justify-space-between flex-column"
            variant="outlined"
          >
            <div class="d-flex flex-column">
              <div
                class="text-center"
                style="font-size: 20px; font-weight: 550"
              >
                Таны авсан үйлчилгээнүүд
              </div>

              <article class="text-center my-8" v-if="servicesCart.length == 0">
                Танд авсан үйлчилгээ байхгүй байна.
              </article>

              <article
                v-for="service in servicesCart"
                class="my-4 d-flex justify-space-between"
              >
                <div>
                  <p style="font-size: 16px">{{ service.title }}</p>
                  <div style="font-size: 14px; color: gray">
                    <v-icon>mdi-clock</v-icon>
                    <span class="mx-1">{{ service.duration }}</span
                    >минут
                  </div>
                </div>
                <div>
                  <p style="font-weight: 550">
                    {{ service.price.toLocaleString() }}₮
                  </p>
                </div>
              </article>
              <article class="mt-4" style="font-size: 20px">
                Нийт:
                <span class="ml-4" style="font-weight: 550"
                  >{{ totalPrice.toLocaleString() }}₮</span
                >
              </article>
              <hr class="my-4" />
            </div>

            <v-row class="ma-0 pa-0">
              <v-col cols="4"></v-col>
              <v-col cols="2" class="px-0">
                <v-btn
                  v-if="step != 0"
                  rounded="lg"
                  color="pink"
                  @click="step--"
                  block
                  ><v-icon>mdi-chevron-left</v-icon></v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn
                  :disabled="servicesCart.length == 0"
                  rounded="lg"
                  color="pink"
                  @click="nextStep()"
                  block
                  >Үргэлжлүүлэх</v-btn
                ></v-col
              >
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "layout",
});

import axios from "axios";
import { useDisplay } from "vuetify";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const step = ref<any>(0);
const categories = ref<any>([]);
const selectedIndex = ref<any>(0);
const selectedCategory = ref<any>("");
const services = ref<any>([]);
const servicesCart = ref<any>([]);
const workersByServices = ref<any>([]);
const selectedWorker = ref<any>("");

const fetchCategories = async () => {
  try {
    const response = await axios.post(`${baseURL}/serviceCategories/list`, {});
    if (response.status === 200) {
      categories.value = response.data.rows;
      selectedCategory.value = response.data.rows[0]._id;
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchWorkersByGivenService = async () => {
  try {
    let services: any = [];
    servicesCart.value.map((service: any) => {
      services.push(service._id);
    });
    const query = {
      services: services,
    };
    const response = await axios.post(
      `${baseURL}/services/getWorkerByService`,
      query
    );
    if (response.status === 200) {
      workersByServices.value = response.data;
    } else {
      console.log("Jiijii");
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchServices = async () => {
  try {
    const filter = {
      category: selectedCategory.value,
    };
    const response = await axios.post(`${baseURL}/services/list`, {
      filter: filter,
    });
    if (response.status === 200) {
      services.value = response.data.rows;
    } else {
      console.log("jiji");
    }
  } catch (err) {
    console.log(err);
  }
};

const addToServiceCart = (service: any) => {
  try {
    servicesCart.value.push(service);
  } catch (err) {
    console.log(err);
  }
};

const removeItemFromServiceCart = (service: any) => {
  const index = servicesCart.value.findIndex(
    (item: any) => item._id == service._id
  );
  if (index != -1) {
    servicesCart.value.splice(index, 1);
  } else {
    console.log("not found in cart");
  }
};

const nextStep = async () => {
  try {
    step.value++;
    if (step.value == 1) {
      await fetchWorkersByGivenService();
    }
  } catch (err) {
    console.log(err);
  }
};

const checkItemOnCart = (service: any) => {
  return servicesCart.value.some((obj: any) => service._id == obj._id);
};

const totalPrice = computed(() => {
  let sum = servicesCart.value.reduce((accumulator: any, service: any) => {
    return accumulator + service.price;
  }, 0);
  return sum;
});

const checkSelectedWorker = (worker: any) => {
  if (selectedWorker.value._id == worker._id) {
    return true;
  }
  return false;
};

onMounted(async () => {
  await fetchCategories();
  await fetchServices();
});
</script>

<style scoped>
.selectedClass {
  background-color: #e91e63;
  color: white;
}

.selectedService {
  border: 1px solid #e91e63 !important;
}
</style>
