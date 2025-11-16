export type Topic = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  topics: Topic[];
};
