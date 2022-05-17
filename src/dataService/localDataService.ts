import { board, card, comment, project, user, userInfo } from "../board";
import { AbstractDataService } from "./index";

class LocalDataService implements AbstractDataService {
  async getAllProjects(user: user): Promise<project[]> {
    const localProjects = localStorage.getItem("projects");
    if (localProjects) {
      try {
        const projects: project[] = JSON.parse(localProjects);
        return projects;
      } catch (error) {
        console.log(error);
        localStorage.removeItem("projects");
      }
    }
  }

  async getAllCardsOfUser(user: user): Promise<card[]> {
    const localUserCards = localStorage.getItem("cards");
    if (localUserCards) {
      try {
        const cardsByUser: card[] = JSON.parse(localUserCards);
        return cardsByUser;
      } catch (error) {
        console.log(error);
        localStorage.removeItem("cards");
      }
    }
  }

  async createBoard(
    newBoardName: string,
    projectId: string,
    user: user
  ): Promise<board> {
    const newBoard: board = {
      name: newBoardName,
      user,
      cards: []
    } as board;

    return newBoard;
  }

  async createCard(newCard: card, user: user): Promise<card> {
    return newCard;
  }

  async createComment(newComment: comment, user: user): Promise<comment> {
    return newComment;
  }

  async createProject(newProject: project, user: user): Promise<project> {
    return newProject;
  }

  async deleteBoard(boardId: string, user: user): Promise<board> {
    return {} as board;
  }

  async deleteCard(cardId: string, user: user): Promise<card> {
    return {} as card;
  }

  async deleteComment(commentId: string, user: user): Promise<comment> {
    return {} as comment;
  }

  async updateCard(newCard: card, user: user): Promise<card> {
    return {} as card;
  }

  async updateProject(newProject: project, user: user): Promise<project> {
    return {} as project;
  }

  async updateUserInfo(userInfo: userInfo, user: user): Promise<user> {
    return {} as user;
  }
}

export default new LocalDataService();
