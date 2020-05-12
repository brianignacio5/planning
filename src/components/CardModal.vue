<template>
  <div class="card-modal" :class="{ active: isActive }">
    <div class="modal-content">
      <span class="close-button" @click="toggleModal">&times;</span>
      <h1>{{ card.title }}</h1>
      <p>Assigned to: {{ card.assignee }}</p>
      <p>Created by: {{ card.owner }}</p>
      <p>{{ card.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { card } from "../board";

@Component
export default class CardModal extends Vue {
  @Prop() card!: card;
  @Prop() isActive: boolean;
  // https://sabe.io/tutorials/how-to-create-modal-popup-box
  toggleModal() {
    this.isActive = !this.isActive;
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
  background-color: white;
  padding: 1rem 1.5rem;
  width: 24rem;
  border-radius: 0.5em;
}

.close-button {
  float: right;
  width: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: lightgray;
}
.close-button {
  background-color: darkgray;
}

.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}
</style>
