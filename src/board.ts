export interface board {
  id: string;
  name: string;
  cards: card[];
}

export interface card {
  assignee: user;
  comments: comment[];
  description: string;
  id: string;
  owner: user;
  picture: string;
  title: string;
  createdOn: Date;
}

export interface user {
  id: string;
  name: string;
  picture: string;
}

export interface comment {
  content: string;
  id: string;
  createdOn: Date;
  createdBy: user;
}