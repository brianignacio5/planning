import Vue from "vue";
import Vuex from "vuex";
import { board, card } from "../board";
import { MutationTree } from "vuex";
import { myBoards } from "./myBoards";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  modalIsActive: boolean;
  selectedCard: card;
}

export const planningState: PlanState = {
  boards: myBoards, // [],
  modalIsActive: false,
  selectedCard: {
    assignee: { id: "", name: "" },
    comments: [],
    description: "",
    id: "",
    owner: { id: "", name: "" },
    title: ""
  }
};

export const mutations: MutationTree<PlanState> = {
  setModalIsActive(state, isModalActive: boolean) {
    const newState = state;
    newState.modalIsActive = isModalActive;
    state = { ...newState };
  },
  setSelectedCard(state, newCard: card) {
    const newState = state;
    newState.selectedCard = newCard;
    state = { ...newState };
  },
  updateBoardWithCardIndex(
    state,
    opts: {
      cardId: string;
      destBoardId: string;
      destIndex: number;
    }
  ) {
    const newState = state;
    let prevBoardIndex;
    let newBoardIndex;
    let prevBoardCardIndex;
    let cardObj;
    for (let i = 0; i < newState.boards.length; i++) {
      if (newState.boards[i].id === opts.destBoardId) {
        newBoardIndex = i;
      }
      for (let j = 0; j < newState.boards[i].cards.length; j++) {
        if (newState.boards[i].cards[j].id === opts.cardId) {
          prevBoardIndex = i;
          prevBoardCardIndex = j;
          cardObj = newState.boards[i].cards[j];
        }
      }
    }
    newState.boards[prevBoardIndex].cards.splice(prevBoardCardIndex, 1);
    newState.boards[newBoardIndex].cards.splice(opts.destIndex, 0, cardObj);
  }
};

export default new Vuex.Store({
  state: planningState,
  mutations,
  actions: {},
  modules: {}
});
