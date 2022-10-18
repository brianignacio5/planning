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

  saveProjectsLocally(projects: project[]) {
    const parsedProjects = JSON.stringify(projects);
    localStorage.setItem("projects", parsedProjects);
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
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const boardId = localProjects[projectId].boards.length;
    const newBoard: board = {
      name: newBoardName,
      user,
      cards: [],
      _id: boardId.toString(),
      project: projectId
    } as board;
    localProjects[projectId].boards.push(newBoard);
    this.saveProjectsLocally(localProjects);
    return newBoard;
  }

  async createCard(newCard: card, user: user): Promise<card> {
    return newCard;
  }

  async createComment(newComment: comment, user: user): Promise<comment> {
    return newComment;
  }

  async createProject(newProject: project, user: user): Promise<project> {
    const localProjects = await this.getAllProjects(user);
    newProject._id = localProjects ? localProjects.length.toString(): "0";
    newProject.boards = [];
    return newProject;
  }

  async deleteBoard(board: board, user: user): Promise<board> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const boardId = localProjects[board.project].boards.findIndex((b) => b._id === board._id);
    const deletedBoard = localProjects[board.project].boards.splice(boardId, 1);
    this.saveProjectsLocally(localProjects);
    return deletedBoard as board;
  }

  async deleteCard(card: card, user: user): Promise<card> {
    return {} as card;
  }

  async deleteComment(comment: comment, user: user): Promise<comment> {
    return {} as comment;
  }

  async updateCard(newCard: card, user: user): Promise<card> {
    return {} as card;
  }

  async updateProject(newProject: project, user: user): Promise<project> {
    const localProjects = await this.getAllProjects(user);
    if (localProjects) {
      const projIndex = localProjects.findIndex((p) => p._id === newProject._id);
      localProjects.splice(projIndex, 1, newProject);
      this.saveProjectsLocally(localProjects);
    }
    return newProject;
  }

  async updateUserInfo(userInfo: userInfo, user: user): Promise<user> {
    return {} as user;
  }
}

export default new LocalDataService();
