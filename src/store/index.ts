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
  addNewBoard(state, boardName) {
    const newBoard: board = {
      name: boardName,
      id: boardName.replace(/\s+/g, ""),
      cards: []
    };
    state.boards.push(newBoard);
  },
  addNewCardInBoard(
    state,
    opts: {
      boardId: string;
      cardName: string;
    }
  ) {
    for (const board of state.boards) {
      if (board.id === opts.boardId) {
        const newCard: card = {
          title: opts.cardName,
          description: "",
          owner: { id: "", name: "" },
          assignee: { id: "", name: "" },
          id: opts.cardName.replace(/\s+/g, ""),
          comments: []
        };
        board.cards.push(newCard);
      }
    }
  },
  setModalIsActive(state, isModalActive: boolean) {
    state.modalIsActive = isModalActive;
  },
  setSelectedCard(state, newCard: card) {
    state.selectedCard = newCard;
  },
  updateBoardWithCardIndex(
    state,
    opts: {
      cardId: string;
      destBoardId: string;
      destIndex: number;
    }
  ) {
    let prevBoardIndex;
    let newBoardIndex;
    let prevBoardCardIndex;
    let cardObj;
    for (let i = 0; i < state.boards.length; i++) {
      if (state.boards[i].id === opts.destBoardId) {
        newBoardIndex = i;
      }
      for (let j = 0; j < state.boards[i].cards.length; j++) {
        if (state.boards[i].cards[j].id === opts.cardId) {
          prevBoardIndex = i;
          prevBoardCardIndex = j;
          cardObj = state.boards[i].cards[j];
        }
      }
    }
    state.boards[prevBoardIndex].cards.splice(prevBoardCardIndex, 1);
    state.boards[newBoardIndex].cards.splice(opts.destIndex, 0, cardObj);
  },
  removeBoard(state, boardId: string) {
    for (let i = 0; i < state.boards.length; i++) {
      if (state.boards[i].id === boardId) {
        state.boards.splice(i, 1);
      }
    }
  },
  removeCard(state, cardId: string) {
    for (let i = 0; i < state.boards.length; i++) {
      for (let j = 0; j < state.boards[i].cards.length; j++) {
        if (state.boards[i].cards[j].id === cardId) {
          state.boards[i].cards.splice(j, 1);
          return;
        }
      }
    }
  }
};

export default new Vuex.Store({
  state: planningState,
  mutations,
  actions: {},
  modules: {}
});
