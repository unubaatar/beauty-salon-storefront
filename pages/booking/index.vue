<template>
  <div class="d-flex justify-center w-100">
    <div style="max-width: 1080px; width: 100%; min-height: 100vh">
      <v-row>
        <v-col cols="12" md="7" v-if="step == 0" class="px-8">
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

          <v-skeleton-loader
            v-if="loading"
            class="my-4"
            type="card"
          ></v-skeleton-loader>
          <v-skeleton-loader
            v-if="loading"
            class="my-4"
            type="card"
          ></v-skeleton-loader>
          <v-skeleton-loader
            v-if="loading"
            class="my-4"
            type="card"
          ></v-skeleton-loader>

          <div v-else>
            <v-card
              style="cursor: pointer; max-height: 160px"
              v-for="service in services"
              class="pa-4 my-4 d-flex justify-space-between align-center"
              :style="
                checkItemOnCart(service)
                  ? 'border: 2px solid #e91e63; background-color:  #ffcccc '
                  : 'border: 1px solid #d9d9d9'
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
            <v-col cols="4">
              <v-skeleton-loader
                v-if="loading"
                class="my-4"
                type="card"
              ></v-skeleton-loader>
            </v-col>

            <v-col cols="4">
              <v-skeleton-loader
                v-if="loading"
                class="my-4"
                type="card"
              ></v-skeleton-loader>
            </v-col>

            <v-col cols="4">
              <v-skeleton-loader
                v-if="loading"
                class="my-4"
                type="card"
              ></v-skeleton-loader>
            </v-col>
          </v-row>

          <v-row>
            <v-col v-for="worker in workersByServices" cols="12" md="4">
              <v-card
                :style="
                  checkSelectedWorker(worker)
                    ? 'border: 2px solid #e91e63; background-color:  #e6e6e6 '
                    : 'border: 1px solid #d9d9d9'
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
                  style="font-size: 16px; font-weight: 550"
                  :style="checkSelectedWorker(worker) ? 'color: black' : ''"
                >
                  {{ worker.firstName }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="7" v-if="step == 2">
          <div style="font-size: 24px; font-weight: 550">Цаг сонголт</div>
          <div class="d-flex justify-space-between align-center">
            <div style="font-weight: 550;">
              <span>{{ weekdays.year }}-оны</span>
              <span class="ml-2">{{ weekdays.month }} сар</span>
              <span></span>
            </div>
            <div class="d-flex">
              <v-btn
                @click="getPreviousWeekDays()"
                variant="text"
                size="small"
                class="mx-2"
                icon="mdi-chevron-left"
              ></v-btn>
              <v-btn
                @click="getNextWeekDays()"
                variant="text"
                size="small"
                class="mx-2"
                icon="mdi-chevron-right"
              ></v-btn>
            </div>
          </div>
          <div class="d-flex justify-space-around mt-4">
            <v-btn
              @click="
                selectedDay = day;
                fetchPossibleTimes();
              "
              icon=""
              v-for="day in weekdays.days"
              variant="outlined"
              style="border: 2px solid #d9d9d9"
              size="large"
              :style="
                checkSelectedDay(day)
                  ? 'border: 2px solid #e91e63; background-color:  #e6e6e6'
                  : ''
              "
            >
              {{ day.day }}
            </v-btn>
          </div>
          <v-row>
            <v-col cols="6" md="3" v-for="i in 12" v-if="loading">
              <v-skeleton-loader class="my-4" type="card"></v-skeleton-loader>
            </v-col>

            <v-card
              variant="outlined"
              v-if="!loading && possibleTimes.length == 0"
              class="w-100 d-flex justify-center align-center mt-8 mx-8"
              style="min-height: 400px; border: 1px solid #d9d9d9"
            >
              Уучлаарай хараахан цаг алга байна.
            </v-card>

            <v-col
              cols="6"
              md="3"
              v-for="time in possibleTimes"
              class="mt-4"
              v-if="!loading && possibleTimes.length > 0"
            >
              <v-card
                @click="selectedTime = time"
                :style="
                  checkSelectedTime(time)
                    ? 'border: 2px solid #e91e63; background-color:  #e6e6e6 '
                    : 'border: 1px solid #d9d9d9;'
                "
                variant="outlined"
                class="d-flex justify-center align-center"
                style="min-height: 100px"
              >
                {{ time.time }}
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="5">
          <v-card
            style="min-height: 400px; border: 1px solid #d9d9d9"
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
                  :disabled="
                    (servicesCart.length == 0 && step == 0) ||
                    (!selectedWorker && step == 1) ||
                    (!selectedTime && step == 2)
                  "
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
import moment from "moment";
const { mdAndUp } = useDisplay();

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

const loading = ref<any>(true);
const step = ref<any>(0);
const categories = ref<any>([]);
const selectedIndex = ref<any>(0);
const selectedCategory = ref<any>("");
const services = ref<any>([]);
const servicesCart = ref<any>([]);
const workersByServices = ref<any>([]);
const selectedWorker = ref<any>("");
const possibleTimes = ref<any>([]);
const selectedTime = ref<any>("");
const selectedDay = ref<any>("");
const schedule = ref<any>("");

const weekdays = ref<any>({
  year: "",
  month: "",
  days: [],
});

const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await axios.post(`${baseURL}/serviceCategories/list`, {});
    if (response.status === 200) {
      categories.value = response.data.rows;
      selectedCategory.value = response.data.rows[0]._id;
      loading.value = false;
    } else {
      console.log("jiijii");
      loading.value = false;
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const fetchWorkersByGivenService = async () => {
  try {
    loading.value = true;
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
      loading.value = false;
    } else {
      loading.value = false;
      console.log("Jiijii");
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const fetchServices = async () => {
  try {
    loading.value = true;
    const filter = {
      category: selectedCategory.value,
    };
    const response = await axios.post(`${baseURL}/services/list`, {
      filter: filter,
    });
    if (response.status === 200) {
      services.value = response.data.rows;
      loading.value = false;
    } else {
      console.log("jiji");
      loading.value = false;
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const fetchPossibleTimes = async () => {
  try {
    possibleTimes.value = [];
    loading.value = true;
    let totalDuration = 0;
    servicesCart.value.map((service: any) => {
      totalDuration += service.duration;
    });
    const query = {
      worker: selectedWorker.value._id,
      duration: totalDuration,
      dateTitle: selectedDay.value.date,
    };
    const response = await axios.post(
      `${baseURL}/timeRequests/getPossibleTimes`,
      query
    );
    if (response.status === 200) {
      possibleTimes.value = response.data.rows;
      schedule.value = response.data.schedule;
      loading.value = false;
    } else {
      console.log("jiijii");
      loading.value = false;
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const createTimeReserve = async () => {
  try {
    let services: any = [];
    servicesCart.value.map((service: any) => {
      services.push(service._id);
    });

    const query = {
      customer: "67a228bea4d6cb41926e2ea2",
      services: services,
      schedule: schedule.value,
      startTime: selectedTime.value.time,
    };

    const response = await axios.post(`${baseURL}/timeReserves/create`, query);
    if (response.status === 201) {
      window.alert("Амжилттай");
    } else {
      console.log("jiijii");
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const addToServiceCart = (service: any) => {
  try {
    servicesCart.value.push(service);
  } catch (err) {
    loading.value = false;
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
    } else if (step.value == 2) {
      // await fetchPossibleTimes();
    } else if (step.value == 3) {
      await createTimeReserve();
    }
  } catch (err) {
    console.log(err);
  }
};

const getNextWeekDays = () => {
  possibleTimes.value = [];
  selectedDay.value = {};
  const now = moment(weekdays.value.days[0].date).add(7, "days");
  let startDate;
  startDate = now.startOf("week").add(1, "days");
  weekdays.value.days = [];
  weekdays.value.year = now.format("YYYY");
  weekdays.value.month = now.format("MM");

  for (let i = 0; i < 7; i++) {
    weekdays.value.days.push({
      day: startDate.clone().add(i, "days").format("DD"),
      dayName: startDate.clone().add(i, "days").format("dddd"),
      date: startDate.clone().add(i, "days").format("YYYY-MM-DD"),
    });
  }
};

const getPreviousWeekDays = () => {
  possibleTimes.value = [];
  selectedDay.value = {};
  const now = moment(weekdays.value.days[0].date).subtract(7, "days");
  let startDate;
  startDate = now.startOf("week").add(1, "days");
  weekdays.value.days = [];
  weekdays.value.year = now.format("YYYY");
  weekdays.value.month = now.format("MM");
  for (let i = 0; i < 7; i++) {
    weekdays.value.days.push({
      day: startDate.clone().add(i, "days").format("DD"),
      dayName: startDate.clone().add(i, "days").format("dddd"),
      date: startDate.clone().add(i, "days").format("YYYY-MM-DD"),
    });
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

const checkSelectedDay = (day: any) => {
  if (selectedDay.value.date == day.date) {
    return true;
  }
  return false;
};

const checkSelectedTime = (time: any) => {
  if (selectedTime.value.time == time.time) {
    return true;
  }
  return false;
};

onMounted(async () => {
  await fetchCategories();
  await fetchServices();

  let today = moment();
  let startDate;

  startDate = moment().startOf("week").add(1, "days");

  weekdays.value.year = today.format("YYYY");
  weekdays.value.month = today.format("MM");

  for (let i = 0; i < 7; i++) {
    weekdays.value.days.push({
      day: startDate.clone().add(i, "days").format("DD"),
      dayName: startDate.clone().add(i, "days").format("dddd"),
      date: startDate.clone().add(i, "days").format("YYYY-MM-DD"),
    });
  }
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
