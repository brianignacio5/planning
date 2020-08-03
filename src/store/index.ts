import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { board, card, user } from "../board";
import { mutations } from "./mutations";
import PlanningDataService from "../dataService";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  modalIsActive: boolean;
  myUser: user;
  selectedCard: card;
}

export const planningState: PlanState = {
  boards: [],
  modalIsActive: false,
  myUser: {
    token: "madsStrings",
    name: "Mads Nielsen",
    picture:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    boards: [],
  },
  selectedCard: {
    board: "",
    comments: [],
    createdOn: new Date(),
    description: "",
    _id: "",
    picture: "",
    title: "",
  },
};

export const actions: ActionTree<PlanState, any> = {
  async getBoardsLocally(context) {
    const onlineBoards = await PlanningDataService.getAllBoardsForUser(context.state.myUser.token);
    if (onlineBoards) {
      context.commit("setBoards", onlineBoards);
      return;
    }
    const localBoards = localStorage.getItem("boards");
    if (localBoards) {
      try {
        const boards = JSON.parse(localBoards);
        context.commit("setBoards", boards);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("boards");
      }
    }
  },
  async createBoard(context, newBoard: string) {
    try {
      const savedBoard = await PlanningDataService.createBoard(
        newBoard,
        context.state.myUser.token
      );
      context.state.boards.push(savedBoard);
    } catch (error) {
      console.log(error);
    }
  },
  async createCard(context, newCard: card) {
    try {
      const savedCard = await PlanningDataService.createCard(
        newCard,
        context.state.myUser.token
      );
      for (let i = 0; i < context.state.boards.length; i++) {
        const board = context.state.boards[i];
        if (board._id === savedCard.board) {
          context.state.boards[i].cards.push(savedCard);
          break;
        }
      }
      this.dispatch("saveBoardsLocally");
    } catch (error) {
      console.log(error);
    }
  },
  async deleteBoard(context, boardId: string) {
    try {
      const resultBoard = await PlanningDataService.deleteBoard(
        boardId,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  async deleteCard(context, cardId: string) {
    try {
      const resultCard = await PlanningDataService.deleteCard(
        cardId,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateCard(context, modifiedCard: card) {
    try {
      const resultCard = await PlanningDataService.updateCard(
        modifiedCard,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  saveBoardsLocally(context) {
    const parsedBoards = JSON.stringify(context.state.boards);
    localStorage.setItem("boards", parsedBoards);
  },
};

export default new Vuex.Store({
  state: planningState,
  mutations,
  actions,
  modules: {},
});
