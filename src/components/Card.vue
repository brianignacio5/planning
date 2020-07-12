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
    <div class="main-card">
      <div class="small-card-title">
        <h4>
          {{ card.title }}
        </h4>
      </div>
      <p>{{ card.description }}</p>
    </div>
    <div class="edit-card" v-if="isCardHovered" @click="showDetail">
      <faIcon icon="edit" class="icon" />
    </div>
    <div class="delete-card" v-if="isCardHovered" @click="removeCard">
      <faIcon icon="times" class="icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { card } from "../board";
import { Action, Mutation } from "vuex-class";

@Component
export default class Card extends Vue {
  @Action private saveBoardsLocally;
  @Prop() card!: card;
  @Mutation setModalIsActive;
  @Mutation setSelectedCard;
  @Mutation("removeCard") removeCardById;
  private isCardHovered = false;

  public toggleCardHover() {
    this.isCardHovered = !this.isCardHovered;
  }

  public dragStart(e) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("card_id", this.card.id);
  }

  removeCard() {
    this.removeCardById(this.card.id);
    this.saveBoardsLocally();
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
  color: #000000;
  box-shadow: 3px 3px 6px #2e2d2d29;
  border-radius: 5px;
  margin: 0.5em;
  display: flex;
  justify-items: center;
}
.card p {
  margin: 0 15px 15px;
  transition: all 0.3s ease;
}

.main-card {
  width: -webkit-fill-available;
}

.small-card-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
}
.icon {
  margin: 1em;
}
.icon:hover {
  color: #3f3f44;
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
  background-color: darkred;
}

.edit-card:hover {
  width: 5em;
  background-color: gold;
}
</style>
