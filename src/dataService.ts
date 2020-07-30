import http from "./http-common";
import { card } from './board';

class PlanningDataService {
  async loginUserByGithub() {
    const response = await http.get("http://localhost:3000/auth/github/session", {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data);
    return response;
  }
  async createCard(newCard: card) {
    const response = await http.post("http://localhost:3000/card", newCard);
    console.log(response.data);
    return response;
  }
  async updateCard(newCard: card) {
    const response = await http.put(`http://localhost:3000/card/${newCard.id}`, newCard);
    console.log(response.data);
    return response;
  }
  async deleteCard(newCard: card) {
    const response = await http.delete(`http://localhost:3000/card/${newCard.id}`);
    console.log(response.data);
    return response;
  }
}

export default new PlanningDataService();
