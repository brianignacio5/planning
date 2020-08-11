import { MutationTree } from "vuex";
import { PlanState } from "./index";
import { board, card, comment, project, user } from "../board";

export const mutations: MutationTree<PlanState> = {
  clearSettingsError(state) {
    state.settingsError = [];
  },
  setBoards(state, boards: board[]) {
    state.boards = boards;
  },
  setProjects(state, projs: project[]) {
    state.projects = projs;
  },
  setCommentsModalIsActive(state, isCommentModalActive: boolean) {
    state.commentsModalIsActive = isCommentModalActive;
  },
  setModalIsActive(state, isModalActive: boolean) {
    state.modalIsActive = isModalActive;
  },
  setSelectedCard(state, newCard: card) {
    state.selectedCard = newCard;
  },
  setSelectedProject(state, proj: project) {
    state.selectedProject = proj;
  },
  setSettingsError(state, error: string) {
    state.settingsError.push(error);
  },
  setUser(state, newUser: user) {
    state.myUser = newUser;
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
      if (state.boards[i]._id === opts.destBoardId) {
        newBoardIndex = i;
      }
      for (let j = 0; j < state.boards[i].cards.length; j++) {
        if (state.boards[i].cards[j]._id === opts.cardId) {
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
      if (state.boards[i]._id === boardId) {
        state.boards.splice(i, 1);
      }
    }
  },
  removeCard(state, cardId: string) {
    for (let i = 0; i < state.boards.length; i++) {
      for (let j = 0; j < state.boards[i].cards.length; j++) {
        if (state.boards[i].cards[j]._id === cardId) {
          state.boards[i].cards.splice(j, 1);
          return;
        }
      }
    }
  },
  removeComment(state, comment: comment) {
    for (let i = 0; i < state.boards.length; i++) {
      for (let j = 0; j < state.boards[i].cards.length; j++) {
        if (state.boards[i].cards[j]._id === comment.card) {
          for (let k = 0; k < state.boards[i].cards[j].comments.length; k++) {
            if (state.boards[i].cards[j].comments[k]._id === comment._id) {
              state.boards[i].cards[j].comments.splice(k, 1);
              return;
            }
          }
        }
      }
    }
  }
};
