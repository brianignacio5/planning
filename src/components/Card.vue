<template>
  <div
    :id="card._id"
    class="card"
    @dragstart="dragStart"
    @dragover.stop
    :draggable="true"
    @mouseenter="toggleCardHover"
    @mouseleave="toggleCardHover"
  >
    <div class="picture" v-if="card.picture">
      <img :src="card.picture" alt="card-picture" />
    </div>
    <div class="card-content">
      <div class="main-card">
        <div class="small-card-title" @click="toggleCardEdit">
          <span @click="showComments">{{ card.title }}</span>
          <div>{{ cardDate }}</div>
        </div>
        <p v-show="!cardEdit">{{ card.description }}</p>
        <input
          type="text"
          name="description"
          :id="cardDescription"
          v-model="card.description"
          v-show="cardEdit"
          @blur="saveCard"
        />
      </div>
      <div class="edit-card" v-if="isCardHovered" @click="showDetail">
        <faIcon icon="edit" class="icon" />
      </div>
      <div class="delete-card" v-if="isCardHovered" @click="removeCard">
        <faIcon icon="times" class="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { usePlanningStore } from "@/store/planning";
import type { card } from "@/types";
import moment from "moment";

const props = defineProps<{ card: card }>();
const planningStore = usePlanningStore();

const isCardHovered = ref(false);
const cardEdit = ref(false);

const cardDescription = `${props.card._id}-desc`;

function toggleCardHover() {
  isCardHovered.value = !isCardHovered.value;
}

function toggleCardEdit() {
  cardEdit.value = !cardEdit.value;
  if (cardEdit.value) {
    nextTick(() => {
      const cardDescElem = document.getElementById(cardDescription);
      if (cardDescElem) {
        cardDescElem.focus();
      }
    });
  }
}

async function saveCard() {
  await planningStore.updateCard(props.card);
  toggleCardEdit();
}

function dragStart(e: DragEvent) {
  e.dataTransfer?.setData("card_id", props.card._id);
  e.dataTransfer?.setData("dragged_card", JSON.stringify(props.card));
}

const cardDate = computed(() => {
  if (props.card.createdOn) {
    // Handle both Date objects and string dates properly
    const date =
      props.card.createdOn instanceof Date ? props.card.createdOn : new Date(props.card.createdOn);

    if (isNaN(date.getTime())) {
      return ""; // Return empty string if date is invalid
    }

    return moment(date).format("MMM DD, YYYY");
  }
  return "";
});

function removeCard() {
  planningStore.deleteCard(props.card);
}

function showDetail() {
  planningStore.selectedCardId = props.card._id;
  planningStore.selectedCardBoardId = props.card.board;
  planningStore.modalIsActive = true;
}

function showComments() {
  planningStore.selectedCardId = props.card._id;
  planningStore.selectedCardBoardId = props.card.board;
  planningStore.commentsModalIsActive = true;
}
</script>

<style scoped>
.card {
  background-color: #fff;
  color: #000000;
  box-shadow: 3px 3px 6px #2e2d2d29;
  border-radius: 15px;
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 320px;
}
.card p {
  margin: 0 15px 15px;
  transition: all 0.3s ease;
}

.card-content {
  display: flex;
  flex-direction: row;
}

.main-card {
  width: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.small-card-title {
  display: flex;
  flex-direction: column;
  margin: 10px 0 5px 15px;
  width: 95%;
}
.small-card-title span {
  font-weight: bold;
  font-size: x-large;
  align-self: flex-start;
}

.small-card-title span:hover {
  color: #ea5151;
}

.small-card-title div {
  font-size: x-small;
  text-align: left;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  align-self: flex-start;
}

.icon {
  margin: 1em;
}

.delete-card,
.edit-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2em;
  transition: all 0.3s ease;
}

.delete-card:hover {
  width: 5em;
  background-color: #ea5151;
}

.edit-card:hover {
  width: 5em;
  background-color: #f2db8f;
}

.picture {
  width: -webkit-fill-available;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
}

.picture img {
  width: 100%;
  height: 100%;
  border-radius: 15px 15px 0 0;
  object-fit: cover;
}
</style>
