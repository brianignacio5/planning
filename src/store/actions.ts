import { ActionTree } from "vuex";
import PlanningDataService from "../dataService";
import { PlanState } from "./index";
import { card, comment, project, user, userInfo } from "../board";

export const actions: ActionTree<PlanState, any> = {
  async getProjectsLocally(context) {
    const onlineProjects = await PlanningDataService.getAllProjects(
      context.state.myUser.token
    );
    if (onlineProjects) {
      context.commit("setProjects", onlineProjects);
      return;
    }
    const localProjects = localStorage.getItem("projects");
    if (localProjects) {
      try {
        const projects = JSON.parse(localProjects);
        context.commit("setProjects", projects);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("projects");
      }
    }
  },
  async getCardsByUser(context) {
    try {
      const cardsByUser = await PlanningDataService.getAllCardsOfUser(
        context.state.myUser.token
      );
      context.commit("setCardsByUser", cardsByUser);
    } catch (error) {
      console.log(error);
    }
  },
  async createBoard(context, payload: { name: string; project: string }) {
    try {
      const savedBoard = await PlanningDataService.createBoard(
        payload.name,
        payload.project,
        context.state.myUser.token
      );
      context.state.boards.push(savedBoard);
      this.dispatch("saveBoardsLocally");
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
  async createComment(
    context,
    payload: { newComment: comment; board: string }
  ) {
    try {
      const savedComment = await PlanningDataService.createComment(
        payload.newComment,
        context.state.myUser.token
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
      this.dispatch("saveBoardsLocally");
    } catch (error) {
      console.log(error);
    }
  },
  async createProject(context, newProject: project) {
    try {
      const savedProject = await PlanningDataService.createProject(
        newProject,
        context.state.myUser.token
      );
      context.state.projects.push(savedProject);
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
  async deleteComment(context, commentId: string) {
    try {
      const resultComment = await PlanningDataService.deleteComment(
        commentId,
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
  async updateProject(context, modifiedProject: project) {
    try {
      const resultProject = await PlanningDataService.updateProject(
        modifiedProject,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateUserInfo(context, userInfo: userInfo) {
    try {
      const resultUser = await PlanningDataService.updateUserInfo(
        userInfo,
        context.state.myUser.token
      );
      console.log(resultUser);
      const newUser: user = {
        email: resultUser.email,
        name: resultUser.name,
        picture: resultUser.picture,
        token: context.state.myUser.token,
      };
      this.commit("setUser", newUser);
    } catch (error) {
      const msg = error.message
        ? error.message
        : "Error at updating user information";
      this.commit("setSettingsError", error.message);
      console.log(error);
    }
  },
  saveBoardsLocally(context) {
    const parsedBoards = JSON.stringify(context.state.boards);
    localStorage.setItem("boards", parsedBoards);
  },
};
