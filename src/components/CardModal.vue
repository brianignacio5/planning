<template>
  <div class="card-modal" :class="{ active: isActive }">
    <div class="modal-content">
      <span class="close-button" @click="toggleModal">&times;</span>
      <template v-if="card">
        <label for="card-title">Title</label>
        <input
          type="text"
          name="title"
          id="card-title"
          v-model="localCard.title"
          @blur="updateCard"
          class="modal-input"
        />
        <label for="card-description">Description</label>
        <input
          type="text"
          name="description"
          id="card-description"
          v-model="localCard.description"
          @blur="updateCard"
          class="modal-input"
        />
        <label for="pictureUrl">Picture:</label>
        <input
          type="text"
          name="picture"
          id="picture-url"
          v-model="localCard.picture"
          @blur="updateCard"
          class="modal-input"
        />
        <label for="assigne">Assignee</label>
        <select
          name="assignee"
          v-model="localCard.assignee"
          @change="updateCard"
          class="modal-input"
        >
          <option v-for="user in projectUsers" :value="user" :key="user.email">
            {{ user.name }} - {{ user.email }}
          </option>
        </select>
        <label for="dueOn">Due on:</label>
        <input
          type="date"
          v-model="datePickerValue"
          @change="handleNativeDateChange"
          class="date-input"
        />
        <button class="delete-btn" @click="removeCard">Delete card</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick } from "vue";
import { usePlanningStore } from "@/store/planning";
import { watch, reactive, ref } from "vue";

const planningStore = usePlanningStore();
const card = computed(() => planningStore.selectedCard);

// Initialize localCard with proper structure
const localCard = reactive({
  title: "",
  description: "",
  picture: "",
  assignee: { email: "", name: "", picture: "", token: "" },
  dueOn: null as Date | null,
});

// Ref for DatePicker value - use string format for native input
const datePickerValue = ref<string>("");

// Watch localCard.dueOn and update datePickerValue
watch(
  () => localCard.dueOn,
  async (newValue) => {
    if (newValue) {
      // Convert Date to yyyy-MM-dd format for native input
      const year = newValue.getFullYear();
      const month = String(newValue.getMonth() + 1).padStart(2, "0");
      const day = String(newValue.getDate()).padStart(2, "0");
      datePickerValue.value = `${year}-${month}-${day}`;

      // Use nextTick to ensure the input is updated
      await nextTick();
    } else {
      datePickerValue.value = "";
    }
  },
  { immediate: true },
);

// Only update localCard when switching to a different card (not on every card change)
let lastCardId = card.value?._id;
let lastBoardId = card.value?.board;
watch(card, (newCard) => {
  if (newCard && (newCard._id !== lastCardId || newCard.board !== lastBoardId)) {
    let convertedDueOn = null;
    if (newCard.dueOn) {
      let date: Date;
      const dueOnValue = newCard.dueOn as any;
      if (typeof dueOnValue === "string") {
        // If it's a string in YYYY-MM-DD format, parse it directly
        const [year, month, day] = dueOnValue.split("-").map(Number);
        date = new Date(year, month - 1, day, 0, 0, 0, 0);
      } else {
        // If it's a Date object, extract the date components
        const originalDate = new Date(dueOnValue);
        const year = originalDate.getFullYear();
        const month = originalDate.getMonth();
        const day = originalDate.getDate();
        date = new Date(year, month, day, 0, 0, 0, 0);
      }

      // Only set convertedDueOn if the date is valid
      if (!isNaN(date.getTime())) {
        convertedDueOn = date;
      }
    }

    Object.assign(localCard, {
      ...newCard,
      dueOn: convertedDueOn,
    });
    lastCardId = newCard._id;
    lastBoardId = newCard.board;
  }
});

const isActive = computed(() => planningStore.modalIsActive);
const projectUsers = computed(() => {
  const project = planningStore.projects.find((p) => p._id === planningStore.selectedProjectId);
  return project ? project.users : [];
});

// Handle date change for native HTML input
function handleNativeDateChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  if (value) {
    const localDate = new Date(value);
    localCard.dueOn = localDate;
    datePickerValue.value = value; // Keep as string for native input
  } else {
    localCard.dueOn = null;
    datePickerValue.value = "";
  }

  updateCard();
}

async function toggleModal() {
  planningStore.modalIsActive = !planningStore.modalIsActive;
  if (!isActive.value && card.value) {
    await updateCard();
  }
}

async function updateCard() {
  if (card.value && localCard) {
    let updated = { ...localCard };
    if (!updated.assignee) {
      if (projectUsers.value.length > 0) {
        updated.assignee = projectUsers.value[0];
      } else {
        updated.assignee = { email: "", name: "", picture: "", token: "" };
      }
    }

    // Ensure dueOn is sent as a date string in YYYY-MM-DD format to avoid timezone issues
    if (updated.dueOn && updated.dueOn instanceof Date && !isNaN(updated.dueOn.getTime())) {
      const year = updated.dueOn.getFullYear();
      const month = String(updated.dueOn.getMonth() + 1).padStart(2, "0");
      const day = String(updated.dueOn.getDate()).padStart(2, "0");
      updated.dueOn = `${year}-${month}-${day}` as any;
    } else {
      // If dueOn is invalid, set it to null
      updated.dueOn = null;
    }

    await planningStore.updateCard(updated as any);
  }
}

function removeCard() {
  // Remove card from store and close modal
  if (card.value) {
    planningStore.deleteCard(card.value);
  }
  planningStore.selectedCardId = null;
  planningStore.selectedCardBoardId = null;
  planningStore.modalIsActive = false;
}

onMounted(() => {
  window.addEventListener("keyup", async (e) => {
    if (e.key === "Escape") {
      if (isActive.value && card.value) {
        await updateCard();
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

/* Modal input styling */
.modal-input,
.date-input {
  width: 100% !important;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.modal-input:focus,
.date-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Ensure select elements have the same width as other inputs */
select.modal-input {
  min-width: 100%;
  max-width: 100%;
}
</style>
