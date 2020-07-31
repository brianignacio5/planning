import { MutationTree } from "vuex";
import { PlanState } from "./index";
import { board, card, user } from "../board";

export const mutations: MutationTree<PlanState> = {
  addNewBoard(state, boardName: string) {
    const newBoard: board = {
      name: boardName,
      _id: boardName.replace(/\s+/g, ""),
      cards: [],
      user: state.myUser
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
      if (board._id === opts.boardId) {
        const newCard: card = {
          title: opts.cardName,
          description: "",
          _id: opts.cardName.replace(/\s+/g, ""),
          comments: [],
          createdOn: new Date(),
          picture: "",
          board: opts.boardId
        };
        board.cards.push(newCard);
      }
    }
  },
  setBoards(state, boards: board[]) {
    state.boards = boards;
  },
  setModalIsActive(state, isModalActive: boolean) {
    state.modalIsActive = isModalActive;
  },
  setSelectedCard(state, newCard: card) {
    state.selectedCard = newCard;
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
  }
};
