import { ActionTree } from "vuex";
import { CardByBoard, dataService } from "../dataService";
import { PlanState } from "./index";
import { board, card, comment, project, user, userInfo } from "../board";

export const actions: ActionTree<PlanState, any> = {
  async getProjects(context) {
    try {
      const projects = await dataService.getAllProjects(context.state.myUser);
      context.commit("setProjects", projects);
    } catch (error) {
      console.log(error);
    }
  },
  async getCardsByUser(context) {
    try {
      const cardsByUser = await dataService.getAllCardsOfUser(
        context.state.myUser
      );
      context.commit("setCardsByUser", cardsByUser);
    } catch (error) {
      console.log(error);
    }
  },
  async createBoard(context, payload: { name: string; project: string }) {
    try {
      const savedBoard = await dataService.createBoard(
        payload.name,
        payload.project,
        context.state.myUser
      );
      context.state.boards.push(savedBoard);
    } catch (error) {
      console.log(error);
    }
  },
  async createCard(context, newCard: card) {
    try {
      const savedCard = await dataService.createCard(
        newCard,
        context.state.myUser
      );
      for (let i = 0; i < context.state.boards.length; i++) {
        const board = context.state.boards[i];
        if (board._id === savedCard.board) {
          context.state.boards[i].cards.push(savedCard);
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createComment(
    context,
    payload: { newComment: comment; board: string }
  ) {
    try {
      const savedComment = await dataService.createComment(
        payload.newComment,
        context.state.myUser,
        payload.board
      );
      for (let i = 0; i < context.state.boards.length; i++) {
        if (context.state.boards[i]._id === payload.board) {
          for (let j = 0; j < context.state.boards[i].cards.length; j++) {
            if (
              context.state.boards[i].cards[j]._id === payload.newComment.card
            ) {
              context.state.boards[i].cards[j].comments.push(savedComment);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createProject(context, newProject: project) {
    try {
      const savedProject = await dataService.createProject(
        newProject,
        context.state.myUser
      );
      context.state.projects.push(savedProject);
    } catch (error) {
      console.log(error);
    }
  },
  async deleteBoard(context, board: board) {
    try {
      const resultBoard = await dataService.deleteBoard(
        board,
        context.state.myUser
      );
    } catch (error) {
      console.log(error);
    }
  },
  async deleteCard(context, card: card) {
    try {
      const resultCard = await dataService.deleteCard(
        card,
        context.state.myUser
      );
    } catch (error) {
      console.log(error);
    }
  },
  async deleteComment(context, payload: { comment: comment; board: string }) {
    try {
      const resultComment = await dataService.deleteComment(
        payload.comment,
        context.state.myUser,
        payload.board
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateCard(context, modifiedCard: card) {
    try {
      const resultCard = await dataService.updateCard(
        modifiedCard,
        context.state.myUser
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateCardByBoard(context, cardInfo: CardByBoard) {
    try {
      const resultCard = await dataService.updateCardByBoard(
        cardInfo,
        context.state.myUser
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateProject(context, modifiedProject: project) {
    try {
      const resultProject = await dataService.updateProject(
        modifiedProject,
        context.state.myUser
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateUserInfo(context, userInfo: userInfo) {
    try {
      const resultUser = await dataService.updateUserInfo(
        userInfo,
        context.state.myUser
      );
      const newUser: user = {
        email: resultUser.email,
        name: resultUser.name,
        picture: resultUser.picture,
        token: context.state.myUser.token,
      };
      context.commit("setUser", newUser);
      context.dispatch("saveUserLocally", newUser);
    } catch (error) {
      const msg = error.message
        ? error.message
        : "Error at updating user information";
      this.commit("setSettingsError", error.message);
      console.log(error);
    }
  },
  setCurrentProject(context) {
    const parsedProject = JSON.stringify(context.state.selectedProject);
    localStorage.setItem("currentProject", parsedProject);
  },
  saveUserLocally(context, user: user) {
    const parsedUser = JSON.stringify(user);
    localStorage.setItem("planningUser", parsedUser);
  },
};
