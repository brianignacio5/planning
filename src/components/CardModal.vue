<template>
  <div class="card-modal" :class="{ active: isActive }">
    <div class="modal-content">
      <span class="close-button" @click="toggleModal">&times;</span>
      <label for="card-title">Title</label>
      <input type="text" name="title" id="card-title" v-model="card.title" />
      <label for="card-description">Description</label>
      <input type="text" name="description" id="card-description" v-model="card.description" />
      <label for="pictureUrl">Picture:</label>
      <input type="text" name="picture" id="picture-url" v-model="card.picture" />
      <label for="assigne">Assignee</label>
      <select name="assignee" v-model="card.assignee">
        <option v-for="user in projectUsers" :value="user" :key="user.email">
          {{ user.name }} - {{ user.email }} -
        </option>
      </select>
      <label for="dueOn">Due on:</label>
      <DatePicker v-model="card.dueOn" class="centerize" />
      <button class="delete-btn" @click="removeCard">Delete card</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePlanningStore } from "@/store/planning";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

const planningStore = usePlanningStore();
const card = computed(() => planningStore.selectedCard);
const isActive = computed(() => planningStore.modalIsActive);
const projectUsers = computed(() => planningStore.selectedProject.users);

function toggleModal() {
  planningStore.modalIsActive = !planningStore.modalIsActive;
  if (!isActive.value) {
    planningStore.updateCard(card.value);
  }
}

function removeCard() {
  // Remove card from store and close modal
  planningStore.deleteCard(card.value);
  planningStore.modalIsActive = false;
}

onMounted(() => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      if (isActive.value) {
        planningStore.updateCard(card.value);
      }
      planningStore.modalIsActive = false;
    }
  });
});
</script>

<style>
.card-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition:
    visibility 0s linear 0.25s,
    opacity 0.25s 0s,
    transform 0.25s;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #bebebe;
  padding: 5rem 10rem;
  width: 24rem;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
}

.centerize {
  align-self: center;
}

.close-button {
  top: 5%;
  left: 90%;
  position: absolute;
  float: right;
  width: 2rem;
  line-height: 2rem;
  text-align: center;
  font-size: x-large;
  cursor: pointer;
  border-radius: 0.25rem;
}
.close-button:hover {
  background-color: #ea5151;
}

.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition:
    visibility 0s linear 0s,
    opacity 0.25s 0s,
    transform 0.25s;
}

.delete-btn {
  background-color: #ea5151;
  padding: 0.5rem;
  margin-top: 2em;
  border: 0;
  border-radius: 5px;
}
.delete-btn:hover {
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
}
</style>
