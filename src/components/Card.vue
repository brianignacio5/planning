<template>
  <div
    :id="card.id"
    class="card"
    @dragstart="dragStart"
    @dragover.stop
    :draggable="true"
  >
    <div class="small-card-title">
      <h4>
        {{ card.title }}
      </h4>
      <faIcon icon="edit" class="icon" @click="showDetail" />
    </div>
    <p>{{ card.description }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { card } from "../board";
import { Mutation } from "vuex-class";

@Component
export default class Card extends Vue {
  @Prop() card!: card;
  @Mutation setModalIsActive;
  @Mutation setSelectedCard;

  public dragStart(e) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("card_id", this.card.id);
  }

  public showDetail() {
    this.setSelectedCard(this.card);
    this.setModalIsActive(true);
  }
}
</script>

<style scoped>
.card {
  background-color: #3f3f44;
  color: #f7f7f7;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.8);
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  padding: 0.5%;
}
.small-card-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.small-card-title h4 {
  flex-grow: 2;
  font-size: larger;
  padding-left: 2rem;
  margin: 5%;
}
.icon {
  margin: 5%;
}
.icon:hover {
  color: #fdcb9e;
}
</style>
