import { board } from "../board";

export const myBoards: board[] = [
  {
    id: "first",
    name: "first",
    cards: [
      {
        id: "card1",
        title: "card1",
        description: "This awesome card",
        assignee: { id: "user1", name: "Me" },
        comments: [
          {
            id: "comment1",
            content: "Awesome task",
            createdOn: new Date(),
            createdBy: { id: "user1", name: "Me" }
          }
        ],
        owner: { id: "user3", name: "boss" }
      }
    ]
  },
  {
    id: "second",
    name: "second",
    cards: [
      {
        id: "card2",
        title: "card2",
        description: "This crappy card",
        assignee: { id: "user2", name: "He" },
        comments: [
          {
            id: "comment1",
            content: "Awesome task",
            createdOn: new Date(),
            createdBy: { id: "user3", name: "boss" }
          }
        ],
        owner: { id: "user3", name: "boss" }
      }
    ]
  }
];
