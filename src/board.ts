export interface board {
  id: string;
  name: string;
  cards: card[];
}

export interface card {
  id: string;
  title: string;
  description: string;
  assignee: user;
  owner: user;
  comments: comment[];
}

export interface user {
  id: string;
  name: string;
}

export interface comment {
  content: string;
  id: string;
  createdOn: Date;
  createdBy: user;
}