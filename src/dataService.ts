import http from "./http-common";
import { card, board } from "./board";

class PlanningDataService {
  async createBoard(newBoardName: string, token: string) {
    const response = await http.post(
      "http://localhost:3000/board",
      { name: newBoardName },
      {
        headers: {
          Authorization: `${token}`
        },
        withCredentials: true
      }
    );
    console.log(response.data);
    const savedBoard: board = response.data;
    return savedBoard;
  }
  async createCard(newCard: card) {
    const response = await http.post("http://localhost:3000/card", newCard);
    console.log(response.data);
    return response;
  }
  async updateCard(newCard: card) {
    const response = await http.put(
      `http://localhost:3000/card/${newCard._id}`,
      newCard
    );
    console.log(response.data);
    return response;
  }
  async deleteCard(newCard: card) {
    const response = await http.delete(
      `http://localhost:3000/card/${newCard._id}`
    );
    console.log(response.data);
    return response;
  }
}

export default new PlanningDataService();
