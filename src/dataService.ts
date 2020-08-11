import http from "./http-common";
import { board, card, comment, project, user, userInfo } from "./board";

class PlanningDataService {
  async getAllProjects(token: string) {
    const response = await http.get(`/project`, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const projects: project[] = response.data;
    return projects;
  }

  async getAllCardsOfUser(token: string) {
    const response = await http.get("/card/user" , {
      headers: {
        Authorization: `${token}`
      },
      withCredentials: true,
    });
    const cards: card[] = response.data;
    return cards;
  }

  async createBoard(newBoardName: string, projectId: string, token: string) {
    const response = await http.post(
      "/board",
      { name: newBoardName, project: projectId },
      {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      }
    );
    const savedBoard: board = response.data;
    return savedBoard;
  }

  async createCard(newCard: card, token: string) {
    const response = await http.post("/card", newCard, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const savedCard: card = response.data;
    return savedCard;
  }

  async createComment(newComment: comment, token: string) {
    const response = await http.post("/comment", newComment, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const savedComment: comment = response.data;
    return savedComment;
  }

  async createProject(newProject: project, token: string) {
    const response = await http.post("/project", newProject, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const savedProject: project = response.data;
    return savedProject;
  }

  async deleteBoard(boardId: string, token: string) {
    const response = await http.delete("/board/" + boardId, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const deletedBoard: board = response.data;
    return deletedBoard;
  }

  async deleteCard(cardId: string, token: string) {
    const response = await http.delete(`/card/${cardId}`, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const deletedCard: card = response.data;
    return deletedCard;
  }

  async deleteComment(commentId: string, token: string) {
    const response = await http.delete(`/comment/${commentId}`, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const deletedComment: comment = response.data;
    return deletedComment;
  }

  async updateCard(newCard: card, token: string) {
    const response = await http.put(`/card/${newCard._id}`, newCard, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const updateCard: card = response.data;
    return updateCard;
  }

  async updateProject(newProject: project, token: string) {
    const response = await http.put(`/project/${newProject._id}`, newProject, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const updatedProject: project = response.data;
    return updatedProject;
  }

  async updateUserInfo(userInfo: userInfo, token: string) {
    const response = await http.put("/auth/user", userInfo, {
      headers: {
        Authorization: `${token}`
      },
      withCredentials: true
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    const updatedUser: user = response.data;
    return updatedUser;
  }
}

export default new PlanningDataService();
