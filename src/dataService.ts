import http from "./http-common";
import { board, card, comment, project } from "./board";

class PlanningDataService {
  async getAllProjects(token: string) {
    const response = await http.get(`http://localhost:3000/project`, {
      headers: {
        Authorization: `${token}`
      },
      withCredentials: true
    });
    const projects: project[] = response.data;
    return projects;
  }
  async createBoard(newBoardName: string, projectId: string, token: string) {
    const response = await http.post(
      "http://localhost:3000/board",
      { name: newBoardName, project: projectId },
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    const savedBoard: board = response.data;
    return savedBoard;
  }
  async deleteBoard(boardId: string, token: string) {
    const response = await http.delete(
      "http://localhost:3000/board/" + boardId,
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    const deletedBoard: board = response.data;
    return deletedBoard;
  }
  async createCard(newCard: card, token: string) {
    const response = await http.post("http://localhost:3000/card", newCard, {
      headers: {
        Authorization: `${token}`
      },
      withCredentials: true
    });
    const savedCard: card = response.data;
    return savedCard;
  }

  async createComment(newComment: comment, token: string) {
    const response = await http.post(
      "http://localhost:3000/comment",
      newComment,
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    const savedComment: comment = response.data;
    return savedComment;
  }
  async createProject(newProject: project, token: string) {
    const response = await http.post(
      "http://localhost:3000/project",
      newProject,
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    const savedProject: project = response.data;
    return savedProject;
  }
  async updateCard(newCard: card, token: string) {
    const response = await http.put(
      `http://localhost:3000/card/${newCard._id}`,
      newCard,
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    const updateCard: card = response.data;
    return updateCard;
  }
  async deleteCard(cardId: string, token: string) {
    const response = await http.delete(`http://localhost:3000/card/${cardId}`, {
      headers: {
        Authorization: `${token}`
      },
      withCredentials: true
    });
    const deletedCard: card = response.data;
    return deletedCard;
  }
  async deleteComment(commentId: string, token: string) {
    const response = await http.delete(
      `http://localhost:3000/comment/${commentId}`,
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    const deletedComment: comment = response.data;
    return deletedComment;
  }
}

export default new PlanningDataService();
