<template>
    <div style="height: 75vh;">
        <div class="d-flex flex-column align-center">
            <div class="mb-2">Та яг одоо цагаа захиалаарай</div>
            <v-btn @click="goToBooking()" rounded="pill" color="pink">Цаг захиалах</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "layout"
});

import { onMounted } from 'vue';
import { useRouter , useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const goToBooking = () => {
    router.push("/booking");
}

onMounted(() => {
})
</script>