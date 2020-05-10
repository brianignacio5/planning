<template>
  <div class="card-modal">
    <div class="modal-content">
      <span class="close-button">&times;</span>
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
  // https://sabe.io/tutorials/how-to-create-modal-popup-box
}
</script>
