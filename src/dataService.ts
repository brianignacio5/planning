import http from "./http-common";

class PlanningDataService {
  async loginUserByGithub() {
    const response = await http.get("http://localhost:3000/auth/github/session", {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data);
    return response;
  }
}

export default new PlanningDataService();
