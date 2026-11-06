<template>
  <div class="calendar">
    <div class="task-list">
      <h2>{{ cardDate }}</h2>
      <ul>
        <li v-for="card in userCards" :key="card._id">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </li>
      </ul>
    </div>
    <div class="datepicker">
      <!-- <DatePicker :inline="true" v-model="currentDate" /> -->
      <input type="date" v-model="currentDate" class="date-input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePlanningStore } from "@/store/planning";
import moment from "moment";

const planningStore = usePlanningStore();
const currentDate = ref<string>("");

// Initialize currentDate with today's date in yyyy-MM-dd format
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
currentDate.value = `${year}-${month}-${day}`;

const userCards = computed(() => {
  if (planningStore.userCards.length > 0 && currentDate.value) {
    const selectedDate = new Date(currentDate.value);
    return planningStore.userCards.filter((c) => {
      const storeDate = new Date(c.dueOn);
      return (
        selectedDate.getDay() === storeDate.getDay() &&
        selectedDate.getMonth() === storeDate.getMonth() &&
        selectedDate.getFullYear() === storeDate.getFullYear()
      );
    });
  }
  return planningStore.userCards;
});

const cardDate = computed(() => {
  if (currentDate.value) {
    const date = new Date(currentDate.value);
    return moment(date).format("MMM DD, YYYY");
  }
  return "";
});

onMounted(() => {
  planningStore.getCardsByUser();
});
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: row;
  margin: 0.25em;
}

.task-list {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.task-list h2 {
  margin: 0.5em;
  color: var(--color-accent);
  font-size: xx-large;
  font-weight: 500;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.task-list ul {
  width: 40%;
  align-self: center;
}

.task-list ul li {
  list-style-type: none;
  margin: 0.5em;
  background-color: var(--color-surface);
  transition: all 0.1s ease;
  color: var(--color-text);
  box-shadow: 3px 3px 6px var(--color-shadow);
  border-radius: 10px;
}

.task-list ul li h3 {
  color: var(--color-accent);
  font-size: x-large;
}

.task-list ul li:hover {
  border-top: 5px solid var(--color-accent);
}

.date-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.date-input:focus {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: var(--shadow-focus);
}
</style>
