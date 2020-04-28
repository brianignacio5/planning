<template>
  <div
    :id="card.id"
    class="card"
    @dragstart="dragStart"
    @dragover.stop
    :draggable="true"
  >
    <h4>{{ card.title }} <faIcon icon="edit" class="icon" /></h4>
    <p>{{ card.description }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { card } from "../board";

@Component
export default class Card extends Vue {
  @Prop() card!: card;

  public dragStart(e) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("card_id", this.card.id);
  }
}
</script>

<style scoped>
.card {
  background-color: #fff3cd;
  color: #041c5c;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.8);
  margin: 5px;
}
.icon:hover {
  color: #cc690d;
}
</style>
