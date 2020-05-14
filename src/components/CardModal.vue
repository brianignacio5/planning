<template>
  <div class="card-modal" :class="{ active: isActive }">
    <div class="modal-content">
      <span class="close-button" @click="toggleModal">&times;</span>
      <label for="card-title">Title</label>
      <input
        type="text"
        name="card-title"
        id="card-title"
        v-model="card.title"
      />
      <label for="card-description">Description</label>
      <input
        type="text"
        name="cardDescription"
        id="card-description"
        v-model="card.description"
      />
      <label for="assigneName">Assigned to</label>
      <input
        type="text"
        name="assigneName"
        id="assignee-name"
        v-model="card.assignee.name"
      />
      <label for="ownerName">Owner:</label>
      <input
        type="text"
        name="ownerName"
        id="owner-name"
        v-model="card.owner.name"
      />
      <button class="delete-btn" @click="removeCard">Delete card</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { card } from "../board";
import { Mutation, State } from "vuex-class";
const ESC_KEY_CODE = 27;
@Component
export default class CardModal extends Vue {
  @State("selectedCard") card!: card;
  @State("modalIsActive") isActive: boolean;
  @Mutation setModalIsActive;
  @Mutation("removeCard") removeCardById;

  toggleModal() {
    this.setModalIsActive(!this.isActive);
  }

  removeCard() {
    this.removeCardById(this.card.id);
    this.setModalIsActive(false);
  }

  mounted() {
    window.addEventListener("keyup", e => {
      if (e.keyCode === ESC_KEY_CODE) {
        this.setModalIsActive(false);
      }
    });
  }
}
</script>

<style scoped>
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
  transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #162447;
  padding: 5rem 10rem;
  width: 24rem;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
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
  background-color: darkgray;
}

.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}

.delete-btn {
  background-color: firebrick;
  padding: 0.5rem;
  margin-top: 2rem;
}
.delete-btn:hover {
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
}
</style>
