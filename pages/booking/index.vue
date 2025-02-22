<template>
    <div class="d-flex justify-center w-100">
        <div style="max-width: 1260px;">
            <div class="d-flex">
                
            </div>
            
        </div>
    </div>

</template>

<script setup lang="ts">
definePageMeta({
    layout: "layout"
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

</script>

<style scoped>

</style>