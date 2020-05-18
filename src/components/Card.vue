<template>
  <div
    :id="card.id"
    class="card"
    @dragstart="dragStart"
    @dragover.stop
    :draggable="true"
    @mouseenter="toggleCardHover"
    @mouseleave="toggleCardHover"
  >
    <div class="small-card-title">
      <h4>
        {{ card.title }}
      </h4>
      <faIcon
        icon="edit"
        class="icon"
        @click="showDetail"
        :style="{ visibility: isCardHovered ? 'visible' : 'hidden' }"
      />
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
  private isCardHovered = false;

  public toggleCardHover() {
    this.isCardHovered = !this.isCardHovered;
  }

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
  background-color: #efefef;
  color: #162447;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.8);
  border-radius: 5px;
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
  align-items: center;
}
.small-card-title h4 {
  flex-grow: 2;
  font-size: larger;
  padding-left: 10%;
}
.icon {
  margin: 5%;
}
.icon:hover {
  color: #3f3f44;
}
</style>
